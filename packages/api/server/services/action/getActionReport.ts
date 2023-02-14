import JSONToCSV from 'json2csv';
import actionModel from '#server/models/actionModel';

export default async (): Promise<string> => JSONToCSV.parse(await actionModel.fetchReport());
