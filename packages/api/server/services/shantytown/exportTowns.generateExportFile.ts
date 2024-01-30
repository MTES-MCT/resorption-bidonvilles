import Excel from 'exceljs';
import excelUtils from '#server/utils/excel';
import moment from 'moment';
import closingSolutionModel from '#server/models/closingSolutionModel';
import { Location } from '#server/models/geoModel/Location.d';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { Shantytown } from '#root/types/resources/Shantytown.d';

import serializeExportProperties from './_common/serializeExportProperties';
import createExportSections, { type ShantytownExportListOption } from './_common/createExportSections';

export default async (user: AuthUser, data: Shantytown[], options: ShantytownExportListOption[], locations: Location[], closedTowns: boolean, date: Date): Promise<Excel.Buffer> => {
    const isNationalExport = locations.some(l => l.type === 'nation');
    const closingSolutions = await closingSolutionModel.findAll();
    const properties = serializeExportProperties(closingSolutions);
    const sections = await createExportSections(user, options, properties, closedTowns, closingSolutions);

    let locationName = '';
    if (isNationalExport) {
        locationName = 'France';
    } else {
        locationName = locations.map((l) => {
            if (l.type === 'departement' || l.type === 'city') {
                return `${l[l.type].name} (${l.departement.code})`;
            }

            return l[l.type].name;
        }).join(', ');
    }

    return excelUtils.createExport(
        closedTowns ? 'fermés' : 'existants',
        locationName,
        sections,
        data,
        moment(date).format('DD/MM/YYYY'),
    );
};
