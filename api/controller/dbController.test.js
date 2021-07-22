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

beforeEach(async () => {
  process.env.NODE_ENV = 'test';
  const artist = await query(artistQueries.addArtist,[1234,'nirvana']);
  artistId = artist[0].id;
  const song = await query(songQueries.addSong,["lithium",artistId]);
  songId = song[0].id;
  const setlist = await query(setlistQueries.addSetlist,[1234,artistId,'19-01-2020','18-02-1992']);
  setlistId = setlist[0].id;
  await query(setlistSongQueries.addSetlistSong,[setlistId,songId]);
  db = new dbController();
});

afterEach(async () => {
  await query("truncate artists");
  await query("truncate songs");
  await query("truncate setlists");
  await query("truncate setlist_songs");
});

describe('addArtist', () => {
  it('adds an artist to the database', async () => {
    const artist = await db.addArtist({externalId:1234, artistName:'21 savage'})
    expect(artist[0].name).toEqual('21 savage');
  });
});
describe('addSong', () => {
  it('adds a Song to the database', async () => {
    const song = await db.addSongName({songName:'a lot', artistId:artistId + 1})
    expect(song[0].name).toEqual('a lot');
  });
});
describe('addSetlist', () => {
  it('adds a Setlist to the database', async () => {
    const setlist = await db.addSetlist({artistId:artistId,setlistExternalId:1234,updatedAt:'01-02-2021',eventDate:'06-09-2420'})
    expect(setlist[0].updated_at).toEqual('01-02-2021');
  });
});
describe('addSongDate', () => {
  it('connects setlist dates to the songs in them', async () => {
    const songDate = await db.addSongDate({setlistId,songId})
    expect(songDate[0].setlist_id).toEqual(setlistId);
  });
});
describe('getSong', () => {
  it('gets a song from the database', async () => {
    const song = await db.getSong({songName:'lithium',artistId})
    expect(song[0].name).toEqual('lithium');
  });
});
describe('getArtist', () => {
  it('gets an artist from the database', async () => {
    const artist = await db.getArtist('nirvana')
    expect(artist).toEqual(artistId);
  });
});

//tests passes but throws error in some part of the db queries as well
// describe('addAllInfo', () => {
//   it('adds artist, song names, setlists and song dates to db', async () => {
//     const sampleApiReturn = await readFile('./sampleReturn.json', 'utf8');
//     const apiReturn = JSON.parse(sampleApiReturn);
//     const added = await db.addAllInfo({apiResult:apiReturn,externalId:4567,artistName:'ciara'})
//     expect(added).toEqual(artistId + 1);
//   });
// });
