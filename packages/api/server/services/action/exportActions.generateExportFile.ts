import ExcelJS from 'exceljs';
import creerClasseurExcel from './exportActions.creerClasseurExcel';

import { ActionReportRow } from '#root/types/resources/Action.d';


export default async function exportActions(
    data: ActionReportRow[],
    fetchedYear: number,
    includeFinances: boolean = true,
    allowedDepartements: string[] | null = null,
): Promise<ExcelJS.Buffer> { return creerClasseurExcel(data, fetchedYear, includeFinances, allowedDepartements); }
