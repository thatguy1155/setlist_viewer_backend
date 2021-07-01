const axios = require("axios");
import { dbController } from './dbController';
import 'dotenv/config';

  export const getSetlist = async (req,res) => {
    try{
      const songName = req.params.song.replace('%20', ' ');
      const artistName = req.params.artistName;
      let apiResult = await getFirstPageOfSetlists(artistName,songName,res)
      let db = new dbController(apiResult)
      const externalId = apiResult.setlist[0].artist.mbid;
      let artistId = await db.getArtist(artistName);

      if (!artistId){
        apiResult = await getRemainingSetlists(artistName,songName,res,apiResult,getAllOtherPages);
        db.updateApiResult(apiResult);
        artistId = await db.addAllInfo({apiResult,externalId,artistName});
      } 
      const dates = await db.getDates({songName:songName,artistId});
      res.send(dates);
    }
    catch(e){
      const errorMsg = {
        __error__:['something went wrong. please try again',e]
      }
      console.log(e)
      res.send(errorMsg)
    }
  }

  export const getFirstPageOfSetlists = async (artist,song,res) => {
    let firstPage = await getSetlistPage(artist,song,res,1);
    firstPage = artistFilter(firstPage,artist)
    return firstPage
  }
  
  export const getRemainingSetlists = async (artist, song, res, apiResult, getAllOtherPages) => {
    const numberOfPages = getPageNumber(apiResult);
    const fullSetlist = apiResult.setlist.concat(await getAllOtherPages(artist,song,res,numberOfPages));
    apiResult.setlist = fullSetlist;
    const newApiResult = artistFilter(apiResult,artist)
    console.log(newApiResult)
    return newApiResult
  }

  function delay() {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve(42);
      }, 200);
    });
  }

  export const getAllOtherPages = async (artist,song,res,pageNumber) => {
    let totalPageResult = [];
    let i;
    for (i = 2; i < pageNumber; i++) {
      await delay();
      let setlist = await getSetlistPage(artist,song,res,i);
      totalPageResult = totalPageResult.concat(setlist.setlist);
    }
    return totalPageResult;
  }
  
  export const getSetlistPage = async (artist,song,res,pageNumber) => {
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
