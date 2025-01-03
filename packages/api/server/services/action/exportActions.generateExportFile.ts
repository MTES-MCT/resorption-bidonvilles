import ExcelJS from 'exceljs';
import creerClasseurExcel from './exportActions.creerClasseurExcel';

import { ActionReportRow } from '#root/types/resources/Action.d';


export default async (data: ActionReportRow[]): Promise<ExcelJS.Buffer> => creerClasseurExcel(data);
