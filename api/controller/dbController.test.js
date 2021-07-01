import { dbController } from './dbController';
import { readFile } from 'fs/promises';
import axios from 'axios';

jest.mock('axios');

describe('dbController Methods', () => {
  
  
    it('compiles songs from multiple sets into one array', async () => {
      const sampleApiReturn = await readFile('./sampleReturn.json', 'utf8');
      const apiReturn = JSON.parse(sampleApiReturn);
      const db = new dbController(apiReturn,"ciara","Goodies",'abcd')
      const sampleSets = 
        [
          {
              song: [
                  {
                      name: "Jackie (B.M.F.)"
                  },
                  {
                      name: "Oh"
                  },
                  {
                      name: "That's How I'm Feelin'"
                  },
                  {
                      name: "1, 2 Step"
                  },
                  {
                      name: "Stuck on You"
                  },
                  {
                      name: "Dance Like We're Making Love"
                  },
              ]
          }
        ]
      
      const sampleResult = ["jackie (b.m.f.)","oh","that's how i'm feelin'","1, 2 step","stuck on you","dance like we're making love"]
      // doing too much// break it down
      expect(db.deriveSongsFromSets(sampleSets)).toEqual(sampleResult);
    });
    it('makes sure getDates returns the dates a song is played', async () => {
      const sampleApiReturn = await readFile('./sampleReturn.json', 'utf8');
      const apiReturn = JSON.parse(sampleApiReturn);
      const db = new dbController(apiReturn,"nirvana","lithium",1234)
      const sampleResult = {"lithium": ["04-01-2020", "10-04-2014", "10-04-2014", "01-03-1994", "27-02-1994", "25-02-1994", "24-02-1994", "22-02-1994", "21-02-1994", "19-02-1994", "18-02-1994", "16-02-1994", "14-02-1994", "12-02-1994", "10-02-1994", "09-02-1994", "08-02-1994", "06-02-1994", "08-01-1994", "07-01-1994", "06-01-1994", "04-01-1994", "03-01-1994", "31-12-1993", "30-12-1993", "29-12-1993", "16-12-1993", "14-12-1993", "13-12-1993", "10-12-1993", "09-12-1993", "08-12-1993", "05-12-1993", "03-12-1993", "02-12-1993", "01-12-1993", "29-11-1993", "28-11-1993", "27-11-1993", "26-11-1993", "15-11-1993", "14-11-1993", "13-11-1993", "12-11-1993", "10-11-1993", "09-11-1993", "08-11-1993", "07-11-1993", "05-11-1993", "04-11-1993", "02-11-1993", "31-10-1993", "30-10-1993", "29-10-1993", "27-10-1993", "26-10-1993", "25-10-1993", "22-10-1993", "19-10-1993", "18-10-1993", "23-07-1993", "09-04-1993", "23-01-1993", "16-01-1993", "30-10-1992", "11-09-1992", "10-09-1992", "09-09-1992", "30-08-1992", "04-07-1992", "03-07-1992", "02-07-1992", "30-06-1992", "28-06-1992", "27-06-1992", "26-06-1992", "24-06-1992", "22-06-1992", "21-06-1992", "22-02-1992", "19-02-1992", "17-02-1992", "16-02-1992", "14-02-1992", "09-02-1992", "07-02-1992", "06-02-1992", "05-02-1992", "02-02-1992", "01-02-1992", "31-01-1992", "30-01-1992", "27-01-1992", "25-01-1992", "24-01-1992", "02-01-1992", "31-12-1991", "29-12-1991", "28-12-1991", "27-12-1991", "05-12-1991", "04-12-1991", "03-12-1991", "02-12-1991", "30-11-1991", "28-11-1991", "27-11-1991", "26-11-1991", "25-11-1991", "23-11-1991", "20-11-1991", "19-11-1991", "17-11-1991", "16-11-1991", "14-11-1991", "13-11-1991", "12-11-1991", "11-11-1991", "10-11-1991", "06-11-1991", "05-11-1991", "04-11-1991", "31-10-1991", "30-10-1991", "29-10-1991", "27-10-1991", "26-10-1991", "25-10-1991", "24-10-1991", "23-10-1991", "21-10-1991", "20-10-1991", "19-10-1991", "17-10-1991", "16-10-1991", "14-10-1991", "12-10-1991", "11-10-1991", "10-10-1991", "15-08-1991", "20-06-1991", "18-06-1991", "17-06-1991", "14-06-1991", "13-06-1991", "29-05-1991", "08-03-1991", "07-03-1991", "05-03-1991", "02-03-1991", "25-11-1990", "27-10-1990", "26-10-1990", "25-10-1990", "24-10-1990", "25-08-1990", "24-08-1990", "23-08-1990", "20-08-1990", "19-08-1990", "20-03-1990"]}
      const artistId = await db.getArtist("nirvana")
      expect(await db.getDates({artistId,songName:"lithium"})).toEqual(sampleResult);
    });
    it('tests the getArtist function to return proper values', async () => {
      const sampleApiReturn = await readFile('./sampleReturn.json', 'utf8');
      const apiReturn = JSON.parse(sampleApiReturn);
      const db = new dbController(apiReturn,"nirvana","lithium",1234)
      
      expect(await db.getArtist("nirvana")).toEqual(54);
    });
    it('tests the getSong function to return proper values', async () => {
      const sampleApiReturn = await readFile('./sampleReturn.json', 'utf8');
      const apiReturn = JSON.parse(sampleApiReturn);
      const db = new dbController(apiReturn,"nirvana","lithium",1234)
      expect(await db.getSong({songName:"lithium",artistId:54})).toEqual(5161);
    });
    it('mocks the addData function', async () => {
      const sampleApiReturn = await readFile('./sampleReturn.json', 'utf8');
      const apiReturn = JSON.parse(sampleApiReturn);
      const db = new dbController(apiReturn,"ciara","goodies",1234)
      const addedArtist = jest.fn()
      const addSetlist = jest.fn().mockReturnValue(1)
      const getSong = jest.fn()

      const pretendToAddAllInfo = (apiResult,addedArtist,addSetlist,getSong) => {
        const artistId = addedArtist()
        let listOfShows = apiResult.setlist
        for (const concert of listOfShows){
          addSetlist(concert.id, concert.lastUpdated, concert.eventDate)
          let concertSets = concert.sets.set
          if (concertSets.length > 0){
            let songsFromThisConcert = db.deriveSongsFromSets(concertSets);
            for (const song of songsFromThisConcert){
              getSong(song)
            }
          }
        }
      }
      pretendToAddAllInfo(apiReturn,addedArtist,addSetlist,getSong)
      expect(addedArtist).toHaveBeenCalledTimes(1);
      expect(addSetlist).toHaveBeenCalledTimes(6);
      expect(getSong).toHaveBeenCalledTimes(50);
      
    });
    
    
    
  });