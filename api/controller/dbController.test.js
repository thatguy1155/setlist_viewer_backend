import { dbController } from './dbController';
import { readFile } from 'fs/promises';
import axios from 'axios';

jest.mock('axios');

describe('dbController Methods', () => {
  
    
    it('compiles songs from multiple sets into one array', async () => {
      const sampleApiReturn = await readFile('./sampleReturn.json', 'utf8');
      const apiReturn = JSON.parse(sampleApiReturn);
      const db = new dbController(apiReturn,"Ciara","Goodies",'abcd')
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
      expect(db.compileSongs(sampleSets)).toEqual(sampleResult);
    });
    
    
    
  });