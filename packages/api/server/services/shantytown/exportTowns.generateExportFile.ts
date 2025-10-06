import Excel from 'exceljs';
import excelUtils from '#server/utils/excel';
import moment from 'moment';
import closingSolutionModel from '#server/models/closingSolutionModel';
import { Location } from '#server/models/geoModel/Location.d';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import { ExportedSitesStatus } from '#root/types/resources/exportedSitesStatus.d';
import { ShantytownExportListOption } from '#root/types/resources/ShantytownExportTypes.d';
import createExportSections from './_common/createExportSections';

import serializeExportProperties from './_common/serializeExportProperties';
import createExportSections, { type ShantytownExportListOption } from './_common/createExportSections';

function exportedTownsStatus(exportedSitesStatus: ExportedSitesStatus) {
    if (!exportedSitesStatus) {
        return '';
    }
    const statusLibs = {
        open: 'existants',
        inProgress: 'en cours de résorption',
        close: 'fernés',
    };
    return statusLibs[exportedSitesStatus];
}

export default async (user: AuthUser, data: Shantytown[], options: ShantytownExportListOption[], locations: Location[], exportedSitesStatus: ExportedSitesStatus, date: Date): Promise<Excel.Buffer> => {
    const isNationalExport = locations.some(l => ['nation', 'metropole', 'outremer'].includes(l.type));
    const closingSolutions = await closingSolutionModel.findAll();
    const properties = serializeExportProperties(closingSolutions);
    const sections = await createExportSections(user, options, properties, exportedSitesStatus, closingSolutions);

    let locationName = '';
    if (isNationalExport) {
        locationName = 'France';
        const hasMetropole = locations.some(l => l.type === 'metropole');
        const hasOutremer = locations.some(l => l.type === 'outremer');

        if (hasMetropole) {
            locationName = 'Hexagone';
        }
        if (hasOutremer) {
            locationName = 'Outremer';
        }
    } else {
        locationName = locations.map((l) => {
            if (l.type === 'departement' || l.type === 'city') {
                return `${l[l.type].name} (${l.departement.code})`;
            }

            return l[l.type].name;
        }).join(', ');
    }

    return excelUtils.createExport(
        exportedTownsStatus,
        locationName,
        sections,
        data,
        moment(date).format('DD/MM/YYYY'),
    );
};
