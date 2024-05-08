import * as path from 'path';

import * as csv from 'csvtojson';
import { CSVParseParam } from 'csvtojson/v2/Parameters';

export async function readCSV(
  fileName: string,
  colParser: CSVParseParam['colParser'] = {},
) {
  return await csv({
    checkType: true,
    colParser,
  }).fromFile(path.join(__dirname, fileName));
}
