const axios = require("axios");
import { dbController } from './dbController';
import 'dotenv/config';

  export const getSetlist = async (req,res) => {
    try{
      const songName = req.params.song.replace('%20', ' ');
      const artistName = req.params.artistName;
      let db = new dbController()
      let artistId = await db.getArtist(artistName);
      if (!artistId){
        const firstPage = await getFirstPageOfSetlists(artistName);
        console.log(firstPage)
        const externalId = firstPage.setlist[0].artist.mbid;
        const apiResult = await getRemainingSetlists({artistName,apiResult:firstPage});
        artistId = await db.addAllInfo({apiResult,externalId,artistName});
      } 
      const dates = await db.getDates({songName:songName,artistId});
      res.send(dates);
    }
    catch(e){
      const errorMsg = {
        __error__:[e]
      }
      console.log(e)
      res.send(errorMsg)
    }
  }

  export const getFirstPageOfSetlists = async (artistName) => {
    let firstPage = await getSetlistPage({artistName,pageNumber:1});
    if (!firstPage) {
      throw 'couldn\'t find the artist.';
    }
    firstPage = artistFilter({returnedInfo:firstPage,artistName})
    return firstPage
  }
  
  export const getRemainingSetlists = async ({artistName, apiResult}) => {
    const numberOfPages = getPageNumber(apiResult);
    const fullSetlist = apiResult.setlist.concat(await getAllOtherPages({artistName,numberOfPages}));
    apiResult.setlist = fullSetlist;
    const newApiResult = artistFilter({returnedInfo:apiResult,artistName})
    return newApiResult
  }

  function delay() {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve(42);
      }, 200);
    });
  }

  export const getAllOtherPages = async ({artistName,numberOfPages}) => {
    let totalPageResult = [];
    let i;
    for (i = 2; i < numberOfPages; i++) {
      await delay();
      let setlist = await getSetlistPage({artistName,pageNumber:i});
      totalPageResult = totalPageResult.concat(setlist.setlist);
    }
    return totalPageResult;
  }

  export const getPageNumber = (data) => Math.ceil(data.total/data.itemsPerPage);

  export const artistFilter = ({returnedInfo,artistName}) => {
    const filteredSetlists = returnedInfo.setlist.filter(set => {
      // console.log('******')
      // console.log(artistName.toLowerCase());
      // console.log(set.artist.name.toLowerCase());
      return set.artist.name.toLowerCase() === artistName.toLowerCase()
    })
    returnedInfo.setlist = filteredSetlists
    return returnedInfo
  }
  
  export const getSetlistPage = async ({artistName,pageNumber}) => {
    let result;
    const URL = `https://api.setlist.fm/rest/1.0/search/setlists?artistName=${artistName}&p=${pageNumber}&sortName&=`;
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
    }
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
