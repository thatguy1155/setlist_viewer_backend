import { dbController } from './dbController';
import 'dotenv/config';

export const getSongs = async (req,res) => {
  try {
    const songName = req.params.song.replace('%20', ' ');
    const { artistName } = req.params;
    let db = new dbController()
    let artistId = await db.getArtist(artistName);
    if (!artistId) throw 'couldn\'t find the artist.';
    const songs = await db.songSearch({name:songName,artistId})
    if (songs.length > 0){
      res.send(songs);
    }

  } catch(e){
    const errorMsg = {
      __error__:[e]
    }
    console.log(e)
    res.send(errorMsg)
  }
  
}