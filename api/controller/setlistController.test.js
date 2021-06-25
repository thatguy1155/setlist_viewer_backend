import { datesPerformed, artistFilter, getPageNumber } from './setlistController';
import { readFile } from 'fs/promises';



describe('setlistController Functions', () => {
  //this test doesn't work anymore because of the db queries
    it('datesPerformed', async () => {
      const sampleApiReturn = await readFile('./sampleReturn.json', 'utf8');
      const parsedSampleAPIReturn = JSON.parse(sampleApiReturn);
      const sampleDatesPerformedResult = 
        [
          "03-05-2015",
          "20-05-2015"
        ]
      // doing too much// break it down
      expect(await datesPerformed(parsedSampleAPIReturn,"goodies").sort()).toEqual(sampleDatesPerformedResult.sort());
    });
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
      expect(artistFilter(sampleApiReturn,"Ciara")).toEqual(sampleResult);
    });
    it('finds number of pages to retrieve', async () => {
      const sampleApiReturn = await readFile('./sampleReturn.json', 'utf8');
      const parsedSampleAPIReturn = JSON.parse(sampleApiReturn);
      // doing too much// break it down
      expect(getPageNumber(parsedSampleAPIReturn)).toEqual(6);
    });
    //use in frontend later
    // it('makes first letter of a word capital except for prepositions', () => {
    //   expect(songCapitalization("livin' on a prayer")).toEqual("Livin' on a Prayer");
    // });
  });