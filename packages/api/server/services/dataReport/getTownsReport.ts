import { TownReport } from './types/TownReport.d';
import initializeTownsReport from './_utils/initializeTownsReport';

export default (argFrom: Date, argTo: Date): TownReport[] => initializeTownsReport(argFrom, argTo);
