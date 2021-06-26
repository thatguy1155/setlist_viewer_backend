import { query } from '../../db/db'
import { 
  artistQueries, setlistQueries, songQueries, setlistSongQueries
  } from '../../db/queries'

  class dbController {
    artistId;
    concertId;
    songId;
    lastUpdated;
    eventDate
    concertSets;
    addedSong;
    constructor(apiResult, artist, song, externalId) {
      this.apiResult = apiResult;
      this.artist = artist;
      this.song = song;
      this.externalId = externalId;
      this.artistId = artistId;
      this.concertId = concertId;
      this.songId = songId;
      this.lastUpdated = lastUpdated;
      this.eventDate = eventDate;
      this.concertSets = concertSets;
      this.addedSong = addedSong;
    }

    addSong = async (song,artistId) => {
      const addResult = await query(songQueries.addSong,[song,artistId]);
      this.songId = addResult[0].id;
    }
    getSong = async () => {
      const getResult = await query(songQueries.getSong,[this.song,artistId]);
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

    addSetlist = async (externalId,artistId,updatedAt,eventDate) => {
      const result = await query(setlistQueries.addSetlist,[externalId,artistId,updatedAt,eventDate]);
      return result[0].id;
    }
  
    addedArtist = async (externalId,artistName) => {
      const result = await query(artistQueries.addArtist,[externalId,artistName]);
      this.artistId = result[0].id;
    }
  
    getArtist = async (artistName) => {
      const result = await query(artistQueries.getArtist,[artistName]);
      console.log(result);
      this.artistId = result ? result[0].id : null;
    }

    getDates = async () => {
      const returnedValue = {};
      const result = await query(setlistSongQueries.getSetlistSong,[this.song,this.artistId])
      const compiledDates = compileDates(result);
      returnedValue[this.song] = compiledDates;
      return returnedValue;
    }
    compileSongs = async () => {
      const songsFromThisConcert = [];
      this.concertSets.forEach(set => set.song.forEach(song => songsFromThisConcert.push(song.name.toLowerCase())));
      return songsFromThisConcert;
    }
    addAllInfo = async () => {
      await this.addedArtist()
      for (const concert of this.apiResult.setlist){
        this.externalId = concert.id;
        this.eventDate = concert.eventDate;
        this.lastUpdated = concert.lastUpdated;
        this.concertId = await addSetlist()
        // console.log(concert);
        this.concertSets = concert.sets.set
        let songsFromThisConcert = this.compileSongs();
        for (const song of songsFromThisConcert){
          this.addedSong = song;
          await this.addSong();
          await this.addSetlistSong();
        }
      }
    }
    // Getter
    get artist() {
      return (async () => {
        await this.getArtist();
        return this.artistId
    })();
    }
  }