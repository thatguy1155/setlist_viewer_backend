import { parseSetList } from './api/controller/setlistController';
import { readFile } from 'fs/promises';

const sampleApiReturn = readFile('./sampleReturn.json', 'utf8');
const sampleFunctionReturn = {
  "2015":{
    "05":2
  }
}

describe('Index test suite', () => {
    it('My Test Case', () => {
      expect(true).toEqual(true);
    })
  });

 

 