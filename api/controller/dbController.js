import { query } from '../../db/db'
import { 
  artistQueries, setlistQueries, songQueries, setlistSongQueries
  } from '../../db/queries'

  export class dbController {
    
    addAllInfo = async ({apiResult,externalId,artistName}) => {
      const artist = await this.addArtist({externalId,artistName});
      const artistId = artist[0].id;
      let setlists = apiResult.setlist
      await this.parseSetlistData({ setlists, artistId })
      return artistId
    }

    parseSetlistData = async ({ setlists, artistId }) => {
      for (const setlist of setlists){
        let addedSetlist = await this.addSetlist({artistId, setlistExternalId:setlist.id, updatedAt:setlist.lastUpdated, eventDate:setlist.eventDate});
        const setlistId = addedSetlist[0].id;
        let sets = setlist.sets.set
        if (sets.length > 0) this.parseSongData({ sets, artistId, setlistId })
      }
    }

    parseSongData = async ({ sets, artistId, setlistId }) => {
      let songs = this.deriveSongsFromSets(sets);
      for (const songName of songs) await this.addSongData({ songName, artistId, setlistId })
    }

    addSongData = async ({ songName, artistId, setlistId }) => {
      const returnedSong = await this.getSong({ songName, artistId });
      let songId;
      if (returnedSong.length > 0) {
        songId = returnedSong[0].id;
      } else {
        const song = await this.addSongName({ songName, artistId });
        songId = song[0].id;
      }
      await this.addSongDate({ setlistId, songId });
    }

    getDates = async ({ artistId, songName }) => {
      const result = await query(setlistSongQueries.getSetlistSong,[songName,artistId])
      const compiledDates = this.datesFromDateObjects(result);
      return { [songName]: compiledDates }
    }

    addSongName = async ({ songName, artistId }) => await query(songQueries.addSong,[songName,artistId]);

    addSongDate = async ({ setlistId, songId }) => query(setlistSongQueries.addSetlistSong,[setlistId,songId]);
    
    addSetlist = async ({ artistId, setlistExternalId, updatedAt, eventDate}) => await query(setlistQueries.addSetlist,[setlistExternalId,artistId,updatedAt,eventDate]);

    addArtist = async ({ externalId, artistName }) => await query(artistQueries.addArtist,[externalId,artistName]);
  
    getArtist = async (artistName) => {
      const result = await query(artistQueries.getArtist,[artistName]);
      return result.length > [0] ? result[0].id : 0;//return null if nothing
    }

    getSong = async ({ songName, artistId }) => await query(songQueries.getSong,[songName,artistId]);

    songNames = (set) => set.song.map(song => song.name);

    deriveSongsFromSets = (sets) => {
      const songsFromThisSetlist = sets.flatMap(set => this.songNames(set));
      return this.downcaseNames(songsFromThisSetlist);
    }

    datesFromDateObjects = (arrayofDateObjects) => {
      return arrayofDateObjects.map(dateObject => dateObject.date);
    }

    downcaseNames = (names) => {return names.map(songName => songName.toLowerCase());}
  }