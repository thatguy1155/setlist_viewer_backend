import { artistFilter, getPageNumber, getSetlistPage, getRemainingSetlists, } from './setlistController';
import { readFile } from 'fs/promises';
import axios from 'axios';

jest.mock('axios');
process.env.NODE_ENV = 'test';

describe('setlistController Functions', () => {
  //this test doesn't work anymore because of the db queries
    // it('datesPerformed', async () => {
      // const sampleApiReturn = await readFile('./sampleReturn.json', 'utf8');
      // const parsedSampleAPIReturn = JSON.parse(sampleApiReturn);
    //   const sampleDatesPerformedResult = 
    //     [
    //       "03-05-2015",
    //       "20-05-2015"
    //     ]
    //   // doing too much// break it down
    //   expect(await datesPerformed(parsedSampleAPIReturn,"goodies").sort()).toEqual(sampleDatesPerformedResult.sort());
    // });
    it('filters out artitst that aren\'t exactly the one searched for', async () => {
      const sampleApiReturn = {
        setlist:[
          {
            artist:{
              name:"Ciara"
            }
          },
          {
            artist:{
              name:"Caari"
            }
          }
        ]
      }
      const sampleResult = {
        setlist:[
          {
            artist:{
              name:"Ciara"
            }
          }
        ]
      }
      // doing too much// break it down
      expect(artistFilter({returnedInfo:sampleApiReturn,artistName:"Ciara"})).toEqual(sampleResult);
    });
    it('tests the API call from setlist fm,', async () => {
      const sampleApiReturn = await readFile('./sampleReturn.json', 'utf8');
      const users = JSON.parse(sampleApiReturn);
      const resp = {data: users};
      axios.get.mockResolvedValue(resp);

      getSetlistPage('Ciara','Goodies',null,1).then(data => expect(data).toEqual(users))
    });
    it('finds number of pages to retrieve', async () => {
      const sampleApiReturn = await readFile('./sampleReturn.json', 'utf8');
      const parsedSampleAPIReturn = JSON.parse(sampleApiReturn);
      // doing too much// break it down
      expect(getPageNumber(parsedSampleAPIReturn)).toEqual(6);
    });
    it('int test for getAllPlaylists function', async () => {
      const sampleApiReturn = await readFile('./sampleReturn.json', 'utf8');
      const parsedSampleAPIReturn = JSON.parse(sampleApiReturn);
      // doing too much// break it down
      const getAllOtherPages = jest
      .fn()
      .mockResolvedValue(null)

      const pretendToGetRemainingSetlists = async ({artistName, songName, res, apiResult}) => {
        const numberOfPages = getPageNumber(apiResult);
        const fullSetlist = apiResult.setlist.concat(await getAllOtherPages(artistName,songName,res,numberOfPages));
        apiResult.setlist = fullSetlist;
        return apiResult
      }
      pretendToGetRemainingSetlists({artistName:'Ciara',songName:'Goodies',res:null, apiResult:parsedSampleAPIReturn})
      expect(getAllOtherPages).toHaveBeenCalledWith('Ciara','Goodies', null, 6);
      expect(await pretendToGetRemainingSetlists({artistName:'Ciara',songName:'Goodies',res:null, apiResult:parsedSampleAPIReturn})).toEqual(parsedSampleAPIReturn);
    });
    

    //use in frontend later
    // it('makes first letter of a word capital except for prepositions', () => {
    //   expect(songCapitalization("livin' on a prayer")).toEqual("Livin' on a Prayer");
    // });
  });