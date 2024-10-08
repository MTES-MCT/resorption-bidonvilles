import ExcelJS from 'exceljs';
import { AuthUser } from '#server/middlewares/authMiddleware';
import creerClasseurExcel from './exportActions.creerClasseurExcel';

import { ActionReportRow } from '#root/types/resources/Action.d';


export default async (user: AuthUser, data: ActionReportRow[]): Promise<ExcelJS.Buffer> => creerClasseurExcel(data);
