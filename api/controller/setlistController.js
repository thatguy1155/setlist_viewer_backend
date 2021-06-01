const axios = require("axios");
import 'dotenv/config';


  exports.getSetlist = async (req,res) => {
    const artist = req.params.artistName;
    const song = req.params.song.replace('%20', ' ');;
    console.log(song);
    const page = 3;
    let result;
    const URL = `https://api.setlist.fm/rest/1.0/search/setlists?artistName=${artist}&p=${page}&sortName&=`;
  
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': `${process.env.API_KEY}`,
      },
    };
    try {
      result = await axios.get(`${URL}`, config);
      console.log(result.data);
      res.send(result.data);
    } catch (error) {
      console.log(error);
      res.status(500).json(err);
    }
  }

  exports.parseSetList = (rawSetListData,song) => {
    return true;
  }

  exports.songCapitalization = (song) => {
    const songTitleArray = song.split(' ');
    songTitleArray.forEach((o, i, a) => a[i] = fixWordCapitalization(a[i]));
    return songTitleArray.join(' ');
  }

  //todo make an exception in the index is 0 ex: 'At the Zoo
  const fixWordCapitalization = (word) => {
    const uncapitalizedWords = ['on','at','a','the','of','for','in','at','by'];
    const isPreposition = (word) => uncapitalizedWords.includes(word);
    const capitalizeFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);
    const possiblyCapitalizedWord = !isPreposition(word) ? capitalizeFirstLetter(word) : word;
    return possiblyCapitalizedWord;
  }