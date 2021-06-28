import { query } from '../../db/db'
import { 
  artistQueries, setlistQueries, songQueries, setlistSongQueries
  } from '../../db/queries'

  export class dbController {
    artistId;
    concertId;
    songId;
    constructor(apiResult, artist, song, artistId, concertId, songId) {
      this.apiResult = apiResult;
      this.artist = artist;
      this.song = song;
      this.externalId = apiResult.setlist[0].artist.mbid;
      this.artistId = artistId;
      this.concertId = concertId;
      this.songId = songId;
    }

    addSong = async (song) => {
      const addResult = await query(songQueries.addSong,[song,this.artistId]);
      this.songId = addResult[0].id;
    }
    
    getSong = async (song) => {
      const getResult = await query(songQueries.getSong,[song,this.artistId]);
      const songInDb = getResult.length > 0;
      if (songInDb) {
        this.songId = getResult[0].id;
      } else {
        this.songId = null;
      }
    }

    addSetlistSong = async () => {
      await query(setlistSongQueries.addSetlistSong,[this.concertId,this.songId])
    }

    addSetlist = async (externalId,updatedAt,eventDate) => {
      const result = await query(setlistQueries.addSetlist,[externalId,this.artistId,updatedAt,eventDate]);
      return result[0].id;
    }
  
    addedArtist = async () => {
      const result = await query(artistQueries.addArtist,[this.externalId,this.artist]);
      this.artistId = result[0].id;
    }
  
    getArtist = async () => {
      const result = await query(artistQueries.getArtist,[this.artist]);
      this.artistId = result.length > [0] ? result[0].id : 0;
      return this.artistId;
    }

    getDates = async () => {
      const returnedValue = {};
      const result = await query(setlistSongQueries.getSetlistSong,[this.song,this.artistId])
      const compiledDates = this.compileDates(result);
      returnedValue[this.song] = compiledDates;
      return returnedValue;
    }
    
    compileSongs = (sets) => {
      const songsFromThisConcert = [];
      sets.forEach(set => set.song.forEach(song => songsFromThisConcert.push(song.name.toLowerCase())));
      return songsFromThisConcert;
    }
    compileDates = (arrayofDateObjects) => {
      const finalDateArray = [];
      arrayofDateObjects.forEach(dateObject => finalDateArray.push(dateObject.date));
      return finalDateArray;
    }

    updateApiResult = (newResult) => {
      this.apiResult = newResult
    }

    addAllInfo = async () => {
      await this.addedArtist()
      let listOfShows = this.apiResult.setlist
      for (const concert of listOfShows){
        this.concertId = await this.addSetlist(concert.id, concert.lastUpdated, concert.eventDate)
        let concertSets = concert.sets.set
        if (concertSets.length > 0){
          let songsFromThisConcert = this.compileSongs(concertSets);
          for (const song of songsFromThisConcert){
            await this.getSong(song)
            this.songId == null && await this.addSong(song);
            await this.addSetlistSong();
          }
        }
      }
    }
  }