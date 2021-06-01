import { parseSetList,songCapitalization } from '../api/controller/setlistController';
import { readFile } from 'fs/promises';

const sampleApiReturn = readFile('./sampleReturn.json', 'utf8');
const sampleFunctionReturn = {
  "2015":{
    "05":2
  }
}

describe('setlistController Functions', () => {
    it('testing parseSetlist', () => {
      expect(parseSetList(sampleApiReturn,"Goodies")).toEqual(sampleFunctionReturn);
    });

    it('makes first letter of a word capital except for prepositions', () => {
      expect(songCapitalization("livin' on a prayer")).toEqual("Livin' on a Prayer");
    });
  });