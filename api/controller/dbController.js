import { query } from '../../db/db'
import { 
  artistQueries, setlistQueries, songQueries, setlistSongQueries
  } from '../../db/queries'

  export class dbController {
    
    addAllInfo = async ({apiResult,externalId,artistName}) => {
      const artistId = await this.addArtist({externalId,artistName})
      let setlists = apiResult.setlist
      await this.parseSetlistData({ setlists, artistId })
      return artistId
    }

    parseSetlistData = async ({ setlists, artistId }) => {
      for (const setlist of setlists){
        let setlistId = await this.addSetlist({artistId, setlistExternalId:setlist.id, updatedAt:setlist.lastUpdated, eventDate:setlist.eventDate})
        let sets = setlist.sets.set
        if (sets.length > 0) this.parseSongData({ sets, artistId, setlistId })
      }
    }

    parseSongData = async ({ sets, artistId, setlistId }) => {
      let songs = this.deriveSongsFromSets(sets);
      for (const songName of songs) await this.addSongData({ songName, artistId, setlistId })
    }

    addSongData = async ({ songName, artistId, setlistId }) => {
      let returnedSong = await this.getSong({ songName, artistId })
      let songId = !returnedSong ? await this.addSongName({ songName, artistId }): returnedSong.id;
      await this.addSongDate({ setlistId, songId });
    }

    getDates = async ({ artistId, songName }) => {
      const result = await query(setlistSongQueries.getSetlistSong,[songName,artistId])
      const compiledDates = this.datesFromDateObjects(result);
      return { [songName]: compiledDates}
    }

    addSongName = async ({ songName, artistId }) => {
      const addResult = await query(songQueries.addSong,[songName,artistId]);
      return addResult[0].id;
    }
    
    getSong = async ({ songName, artistId }) => {
      const songs = await query(songQueries.getSong,[songName,artistId]);
      return songs[0];
    }

    addSongDate = async ({ setlistId, songId }) => {
      await query(setlistSongQueries.addSetlistSong,[setlistId,songId])
    }

    addSetlist = async ({ artistId, setlistExternalId, updatedAt, eventDate}) => {
      const result = await query(setlistQueries.addSetlist,[setlistExternalId,artistId,updatedAt,eventDate]);
      return result[0].id; 
    }
  
    addArtist = async ({ externalId, artistName }) => {
      const result = await query(artistQueries.addArtist,[externalId,artistName]);
      return result[0].id; //return object instead of id and pull the id out in the bigger
    }
  
    getArtist = async (artistName) => {
      const result = await query(artistQueries.getArtist,[artistName]);
      return result.length > [0] ? result[0].id : 0;//return null if nothing
    }

    songNames = (set) => set.song.map(song => song.name)

    deriveSongsFromSets = (sets) => {
      const songsFromThisSetlist = sets.flatMap(set => this.songNames(set));
      return this.downcaseNames(songsFromThisSetlist);
    }

    datesFromDateObjects = (arrayofDateObjects) => {
      return arrayofDateObjects.map(dateObject => dateObject.date);
    }

    downcaseNames = (names) => {return names.map(songName => songName.toLowerCase());}
  }