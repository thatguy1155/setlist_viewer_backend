const axios = require("axios");
import { query } from '../../db/db'
import { 
  artistQueries, setlistQueries, songQueries, setlistSongQueries
  } from '../../db/queries'
import 'dotenv/config';

  export const getSetlist = async (req,res) => {
    try{
      const song = req.params.song.replace('%20', ' ');
      const artist = req.params.artistName;
      let apiResult = await getSetlistPage(req,res,1);
      apiResult = artistFilter(apiResult,artist)
      console.log(apiResult)
      const artistName = apiResult.setlist[0].artist.name;
      const artistExternalId = apiResult.setlist[0].artist.mbid;
      const retreivedArtist = await getArtist(artistName);

      if (!retreivedArtist){
        const newArtistId = await addedArtist(artistExternalId,artistName);
        const numberOfPages = getPageNumber(apiResult);
        const fullSetlist = apiResult.setlist.concat(await getAllOtherPages(req,res,numberOfPages));

        apiResult.setlist = fullSetlist;
        apiResult = artistFilter(apiResult,artist)
        const relevantDates= {};
        relevantDates[song] = await datesPerformed(apiResult,song,newArtistId);
        res.send(relevantDates);
      } 
      else {
        const dates = await getDates(song,retreivedArtist.id);
        res.send(dates);
      }
    }
    catch(e){
      const errorMsg = {
        __error__:['something went wrong. please try again',e]
      }
      res.send(errorMsg)
    }
  }
// break this into two functions called by one function maybe
// maybe there is adding an old song to setlist or adding song without adding to setlist
  const addSong = async (song,artistId,concertId) => {
    const getResult = await query(songQueries.getSong,[song,artistId]);
    const songInDb = getResult.length > 0;
    let songId;
    if (!songInDb) {
      const addResult = await query(songQueries.addSong,[song,artistId]);
      songId = addResult[0].id;
    } else {
      songId = getResult[0].id;
    }
    await query(setlistSongQueries.addSetlistSong,[concertId,songId])
  }

  const addSetlist = async (externalId,artistId,updatedAt,eventDate) => {
    const result = await query(setlistQueries.addSetlist,[externalId,artistId,updatedAt,eventDate]);
    return result[0].id;
  }

  const addedArtist = async (externalId,artistName) => {
    const result = await query(artistQueries.addArtist,[externalId,artistName]);
    return result[0].id;
  }

  const getArtist = async (artistName) => {
    const result = await query(artistQueries.getArtist,[artistName]);
    console.log(result);
    return result[0];
  }

  const getDates = async (song,artistId) => {
    const returnedValue = {};
    const result = await query(setlistSongQueries.getSetlistSong,[song,artistId])
    const compiledDates = compileDates(result);
    returnedValue[song] = compiledDates;
    return returnedValue;
  }

  function delay() {
    // `delay` returns a promise
    return new Promise(function(resolve, reject) {
      // Only `delay` is able to resolve or reject the promise
      setTimeout(function() {
        resolve(42); // After .1 seconds, resolve the promise with value 42
      }, 200);
    });
  }

  export const getAllOtherPages = async (req,res,pageNumber) => {
    let totalPageResult = [];
    let i;
    for (i = 2; i < pageNumber; i++) {
      await delay();
      let setlist = await getSetlistPage(req,res,i);
      totalPageResult = totalPageResult.concat(setlist.setlist);
    }
    return totalPageResult;
  }
  
  export const getSetlistPage = async (req,res,pageNumber) => {
    const artist = req.params.artistName;
    const song = req.params.song.replace('%20', ' ');
    console.log("beginning api call: " + song);
    let result;
    const URL = `https://api.setlist.fm/rest/1.0/search/setlists?artistName=${artist}&p=${pageNumber}&sortName&=`;
  
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': `${process.env.API_KEY}`,
      },
    };
    try {
      result = await axios.get(`${URL}`, config);
      return result.data;
    } catch (error) {
      console.log(error);
      errorMsg = {
        __error__:['something went wrong. please try again',e]
      }
      res.send(errorMsg)
      //res.status(100).json(err);
    }
  }

  export const datesPerformed = async (rawSetListData,song,artistId) => {
    const arrayOfConcerts = rawSetListData.setlist;
    const datesWithSong = []
    for (const concert of arrayOfConcerts){
      //let concertId = await addSetlist(concert.id, artistId, concert.lastUpdated, concert.eventDate)
      // console.log(concert);
      let setsPerformedAtThisConcert = concert.sets.set
      let songsPlayedAtThisConcert = await compileSongs(setsPerformedAtThisConcert,concertId,artistId);
      songsPlayedAtThisConcert.includes(song.toLowerCase()) && datesWithSong.push(concert.eventDate);
    }
    console.log(`dates with song ${datesWithSong}`);
    return datesWithSong;
  }

  const compileDates = (arrayofDateObjects) => {
    const finalDateArray = [];
    arrayofDateObjects.forEach(dateObject => finalDateArray.push(dateObject.date));
    return finalDateArray;
  }
//concertId,artistId
  export const compileSongs = async (concert) => {
    const songsFromThisConcert = [];
    concert.forEach(set => set.song.forEach(song => songsFromThisConcert.push(song.name.toLowerCase())));
    // for (const song of songsFromThisConcert){
    //   await addSong(song,artistId,concertId)
    // }
    return songsFromThisConcert;
  }

  export const getPageNumber = (data) => Math.ceil(data.total/data.itemsPerPage);

  export const artistFilter = (returnedInfo,artist) => {
    const filteredSetlists = returnedInfo.setlist.filter(set => set.artist.name.toLowerCase() === artist.toLowerCase())
    returnedInfo.setlist = filteredSetlists
    return returnedInfo
  }
//use later in frontend

  // exports.songCapitalization = (song) => {
  //   const songTitleArray = song.split(' ');
  //   songTitleArray.forEach((o, i, a) => a[i] = fixWordCapitalization(a[i]));
  //   return songTitleArray.join(' ');
  // }

  // //todo make an exception in the index is 0 ex: 'At the Zoo
  // const fixWordCapitalization = (word) => {
  //   const uncapitalizedWords = ['on','at','a','the','of','for','in','at','by'];
  //   const isPreposition = (word) => uncapitalizedWords.includes(word);
  //   const capitalizeFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);
  //   const possiblyCapitalizedWord = !isPreposition(word) ? capitalizeFirstLetter(word) : word;
  //   return possiblyCapitalizedWord;
  // }
