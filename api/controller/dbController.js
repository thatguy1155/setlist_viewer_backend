import { query } from '../../db/db'
import { 
  artistQueries, setlistQueries, songQueries, setlistSongQueries
  } from '../../db/queries'

  export class dbController {
    
    addAllInfo = async ({apiResult,externalId,artistName}) => {
      const artistId = await this.addedArtist({externalId,artistName})
      let listOfShows = apiResult.setlist
      for (const concert of listOfShows){
        let concertId = await this.addSetlist({artistId, concertExternalId:concert.id, updatedAt:concert.lastUpdated, eventDate:concert.eventDate})
        let concertSets = concert.sets.set
        if (concertSets.length > 0){
          let songsFromThisConcert = this.deriveSongsFromSets(concertSets);
          for (const songName of songsFromThisConcert){
            let returnedSong = await this.getSong({songName,artistId})
            let songId = !returnedSong ? await this.addSong({songName,artistId}): returnedSong;
            await this.addSetlistSong({concertId,songId});
          }
        }
      }
      return artistId
    }

    getDates = async ({artistId,songName}) => {
      const returnedValue = {};
      const result = await query(setlistSongQueries.getSetlistSong,[songName,artistId])
      const compiledDates = this.datesFromDateObject(result);
      returnedValue[songName] = compiledDates;
      return returnedValue;
    }

    addSong = async ({songName,artistId}) => {
      const addResult = await query(songQueries.addSong,[songName,artistId]);
      return addResult[0].id;
    }
    
    getSong = async ({songName,artistId}) => {
      const getResult = await query(songQueries.getSong,[songName,artistId]);
      const songInDb = getResult.length > 0;
      if (songInDb) {
        return getResult[0].id;
      } else {
        return null;
      }
    }

    addSetlistSong = async ({concertId,songId}) => {
      await query(setlistSongQueries.addSetlistSong,[concertId,songId])
    }

    addSetlist = async ({artistId,concertExternalId,updatedAt,eventDate}) => {
      const result = await query(setlistQueries.addSetlist,[concertExternalId,artistId,updatedAt,eventDate]);
      return result[0].id; 
    }
  
    addedArtist = async ({externalId,artistName}) => {
      const result = await query(artistQueries.addArtist,[externalId,artistName]);
      return result[0].id; //return object instead of id and pull the id out in the bigger
    }
  
    getArtist = async (artistName) => {
      console.log(artistName)
      const result = await query(artistQueries.getArtist,[artistName]);
      return result.length > [0] ? result[0].id : 0;//return null if nothing
    }

    songNames = (set) => set.song.map(song => song.name)

    deriveSongsFromSets = (sets) => {
      const songsFromThisConcert = sets.flatMap(set => this.songNames(set));
      return this.downcaseNames(songsFromThisConcert);
    }

    datesFromDateObject = (arrayofDateObjects) => {
      return arrayofDateObjects.map(dateObject => dateObject.date);
    }

    updateApiResult = (newResult) => {
      this.apiResult = newResult
    }

    downcaseNames = (names) => {return names.map(songName => songName.toLowerCase());}
  }