import { dbController } from './dbController';
import { readFile } from 'fs/promises';
import { query } from '../../db/db';
import { 
  artistQueries, setlistQueries, songQueries, setlistSongQueries
  } from '../../db/queries'
import axios from 'axios';

jest.mock('axios');
let db;
let artistId;
let songId;
let setlistId;
let sampleApiReturn;
let apiReturn;
beforeEach(async () => {
  process.env.NODE_ENV = 'test';
  const artist = await query(artistQueries.addArtist,[1234,'nirvana']);
  artistId = artist[0].id;
  const song = await query(songQueries.addSong,["smells like teen spirit",artistId]);
  songId = song[0].id;
  const setlist = await query(setlistQueries.addSetlist,[1234,artistId,'19-01-2020','18-02-1992']);
  setlistId = setlist[0].id;
  await query(setlistSongQueries.addSetlistSong,[setlistId,songId]);
  db = new dbController();

  sampleApiReturn = await readFile('./sampleReturn.json', 'utf8');
  apiReturn = JSON.parse(sampleApiReturn);
});

afterEach(async () => {
  await query("truncate artists");
  await query("truncate songs");
  await query("truncate setlists");
  await query("truncate setlist_songs");
});

// describe('addArtist', () => {
//   it('adds an artist to the database', async () => {
//     const artist = await db.addArtist({externalId:1234, artistName:'21 savage'})
//     expect(artist[0].name).toEqual('21 savage');
//   });
// });
// describe('addSong', () => {
//   it('adds a Song to the database', async () => {
//     const song = await db.addSongName({songName:'a lot', artistId:artistId + 1})
//     expect(song[0].name).toEqual('a lot');
//   });
// });
// describe('addSetlist', () => {
//   it('adds a Setlist to the database', async () => {
//     const setlist = await db.addSetlist({artistId:artistId,setlistExternalId:1234,updatedAt:'01-02-2021',eventDate:'06-09-2420'})
//     expect(setlist[0].updated_at).toEqual('01-02-2021');
//   });
// });
// describe('addSongDate', () => {
//   it('connects setlist dates to the songs in them', async () => {
//     const songDate = await db.addSongDate({setlistId,songId})
//     expect(songDate[0].setlist_id).toEqual(setlistId);
//   });
// });
// describe('getSong', () => {
//   it('gets a song from the database', async () => {
//     const song = await db.getSong({songName:'lithium',artistId})
//     expect(song[0].name).toEqual('lithium');
//   });
// });
// describe('getArtist', () => {
//   it('gets an artist from the database', async () => {
//     const artist = await db.getArtist('nirvana')
//     expect(artist).toEqual(artistId);
//   });
// });

//tests passes but throws error in some part of the db queries as well
describe('addAllInfo', () => {
  it('adds artist, song names, setlists and song dates to db', async () => {
    const added = await db.addAllInfo({apiResult:apiReturn,externalId:4567,artistName:'ciara'})
    expect(added).toEqual(artistId + 1);
  });
  it('added the artist', async () => {
    await db.addAllInfo({apiResult:apiReturn,externalId:4567,artistName:'ciara'})
    const artist = await db.getArtist('ciara')
    expect(artist).toEqual(artistId + 1);
  });
  it('added the song names', async () => {
    const newArtistId = artistId + 1;
    await db.addAllInfo({apiResult:apiReturn,externalId:4567,artistName:'ciara'})
    const song = await db.getSong({songName:'oh',artistId:newArtistId})
    expect(song[0].name).toEqual('oh');
  });
  it('added setlists', async () => {
    await db.addAllInfo({apiResult:apiReturn,externalId:4567,artistName:'ciara'})
    const setlist = await query(setlistQueries.getSetlist,['20-05-2015']);
    expect(setlist[0].date).toEqual('20-05-2015');
  });
  //ask if this one is necessary onr what the best protocol is for this one
  it('added song dates', async () => {

  });
});
//sometimes this test fails if you change to name of the song. I think this is because of duplicates of the songs in the db
describe('getDates', () => {
  it('adds artist, song names, setlists and song dates to db', async () => {
    const newArtistId = artistId + 1;
    await db.addAllInfo({apiResult:apiReturn,externalId:4567,artistName:'ciara'})
    const dates = await db.getDates({artistId:newArtistId,songName:'jackie (b.m.f.)'});
    const expectedResult = {'jackie (b.m.f.)':['20-05-2015','03-05-2015']}
    expect(dates).toEqual(expectedResult)
  });
});
describe('songSearch', () => {
  it('searches for songs whose titles match the search input', async () => {
    const results =  await db.songSearch({name:'smells like teen spirit', artistId})
    const expectedResult = {name: 'smells like teen spirit',rank: 0.4}
    expect(results[0]).toEqual(expectedResult)
  })})
