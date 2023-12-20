import ServiceError from '#server/errors/ServiceError';

import permissionUtils from '#server/utils/permission';
import geoUtils from '#server/utils/geo';
import excelUtils from '#server/utils/excel';
import moment from 'moment';

import geoModel from '#server/models/geoModel';
import shantytownModel from '#server/models/shantytownModel';
import closingSolutionModel from '#server/models/closingSolutionModel';
import statsExportsModel from '#server/models/statsExportsModel';

import { WhereClauseGroup } from '#server/models/_common/types/WhereClauseGroup';
import { Where } from '#server/models/_common/types/Where';
import serializeExportProperties from './_common/serializeExportProperties';
import createExportSections from './_common/createExportSections';
import { ClosingSolution } from '#root/types/resources/ClosingSolution.d';
import { User } from '#root/types/resources/User.d';

export default async (user: User, data) => {
    if (!Object.prototype.hasOwnProperty.call(data, 'locationType')
        || !Object.prototype.hasOwnProperty.call(data, 'locationCode')) {
        throw new ServiceError('data_incomplete', new Error('Le périmètre géographique à exporter est obligatoire'));
    }

    let location;
    try {
        location = await geoModel.getLocation(data.locationType, data.locationCode);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    const today = new Date();
    const askedForHistory = moment(data.date).format('YYYY-MM-DD') !== moment(today).format('YYYY-MM-DD');
    const allowedLocations = permissionUtils.restrict(location).for(user).askingTo('export', askedForHistory ? 'shantytown_history' : 'shantytown');
    if (allowedLocations.length === 0) {
        throw new ServiceError('permission_denied', new Error('Vous n\'êtes pas autorisé(e) à exporter le périmètre géographique demandé'));
    }

    const closedTowns = parseInt(data.closedTowns, 10) === 1;
    const filters: Where = [
        {
            status: {
                not: closedTowns === true,
                value: 'open',
            },
        },
    ];
    const isNationalExport = allowedLocations.some(l => l.type === 'nation');
    if (!isNationalExport) {
        filters.push(
            allowedLocations.reduce((acc, l, index) => {
                acc[`location_${index}`] = {
                    query: `${geoUtils.fromGeoLevelToTableName(l.type)}.code`,
                    value: l[l.type].code,
                };

                if (l.type === 'city') {
                    acc[`location_main_${index}`] = {
                        query: 'cities.fk_main',
                        value: l[l.type].code,
                    };
                }

                return acc;
            }, {} as WhereClauseGroup),
        );
    }

    let shantytowns;
    try {
        if (!askedForHistory) {
            shantytowns = await shantytownModel.findAll(
                user,
                filters,
                'export',
            );
        } else {
            shantytowns = await shantytownModel.getHistoryAtGivenDate(
                user,
                allowedLocations,
                moment(data.date).format('YYYY-MM-DD HH:mm:ss ZZ'),
                closedTowns,
            );
        }
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    if (shantytowns.length === 0) {
        throw new ServiceError('fetch_failed', new Error('Il n\'y a aucun site à exporter pour le périmètre géographique demandé'));
    }

    let closingSolutions: ClosingSolution[];
    try {
        closingSolutions = await closingSolutionModel.findAll();
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    const properties = serializeExportProperties(closingSolutions);
    const sections = await createExportSections(user, data, properties, closedTowns, closingSolutions);

    let locationName = '';
    if (isNationalExport) {
        locationName = 'France';
    } else {
        locationName = allowedLocations.map((l) => {
            if (l.type === 'departement' || l.type === 'city') {
                return `${l[l.type].name} (${l.departement.code})`;
            }

            return l[l.type].name;
        }).join(', ');
    }

    const buffer = await excelUtils.createExport(
        closedTowns ? 'fermés' : 'existants',
        locationName,
        sections,
        shantytowns,
        moment(data.date).format('DD/MM/YYYY'),
    );

    // add that export to the stats
    const stats: ({
        fk_region: string | null,
        fk_departement: string | null,
        fk_epci: string | null,
        fk_city: string | null,
        closed_shantytowns: boolean,
        exported_by: number,
    })[] = [];

    if (isNationalExport) {
        stats.push({
            fk_region: null,
            fk_departement: null,
            fk_epci: null,
            fk_city: null,
            closed_shantytowns: closedTowns,
            exported_by: user.id,
        });
    } else {
        allowedLocations.forEach((l) => {
            const stat = {
                fk_region: null,
                fk_departement: null,
                fk_epci: null,
                fk_city: null,
                closed_shantytowns: closedTowns,
                exported_by: user.id,
            };
            stat[`fk_${l.type}`] = l[l.type].code;

            stats.push(stat);
        });
    }

    try {
        await Promise.all(stats.map(statsExportsModel.create));
    } catch (error) {
        throw new ServiceError('write_failed', error);
    }

    return buffer;
};
