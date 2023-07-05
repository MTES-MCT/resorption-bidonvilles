import ServiceError from '#server/errors/ServiceError';

import permissionUtils from '#server/utils/permission';
import geoUtils from '#server/utils/geo';
import excelUtils from '#server/utils/excel';
import moment from 'moment';

import geoModel from '#server/models/geoModel';
import shantytownModel from '#server/models/shantytownModel';
import closingSolutionModel from '#server/models/closingSolutionModel';
import statsExportsModel from '#server/models/statsExportsModel';

import serializeExportProperties from './_common/serializeExportProperties';
import createExportSections from './_common/createExportSections';

export default async (user, data) => {
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

    if (!permissionUtils.can(user).do('export', 'shantytown').on(location)) {
        throw new ServiceError('permission_denied', new Error('Vous n\'êtes pas autorisé(e) à exporter le périmètre géographique demandé'));
    }

    const today = new Date();

    const closedTowns = parseInt(data.closedTowns, 10) === 1;
    const filters = [
        {
            status: {
                not: closedTowns === true,
                value: 'open',
            },
        },
    ];

    if (location.type !== 'nation') {
        const locationFilters: any = {
            location: {
                query: `${geoUtils.fromGeoLevelToTableName(location.type)}.code`,
                value: location[location.type].code,
            },
        };

        if (location.type === 'city') {
            locationFilters.location_main = {
                query: `${geoUtils.fromGeoLevelToTableName(location.type)}.fk_main`,
                value: location[location.type].code,
            };
        }

        filters.push(locationFilters);
    }

    let shantytowns;
    try {
        if (moment(data.date).format('YYYY-MM-DD') === moment(today).format('YYYY-MM-DD')) {
            shantytowns = await shantytownModel.findAll(
                user,
                filters,
                'export',
            );
        } else {
            shantytowns = await shantytownModel.getHistoryAtGivenDate(
                user,
                location,
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

    let closingSolutions;
    try {
        closingSolutions = await closingSolutionModel.findAll();
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    const properties = serializeExportProperties(closingSolutions);
    const sections = await createExportSections(user, data, properties, closedTowns, closingSolutions);
    let locationName = '';


    if (location.type === 'nation') {
        locationName = 'France';
    } else if (location.type === 'departement' || location.type === 'city') {
        locationName = `${location.departement.code} - ${location[location.type].name}`;
    } else {
        locationName = location[location.type].name;
    }


    const buffer = await excelUtils.createExport(
        closedTowns ? 'fermés' : 'existants',
        locationName,
        sections,
        shantytowns,
        moment(data.date).format('DD/MM/YYYY'),
    );
    // add that export to the stats

    const stat = {
        fk_region: null,
        fk_departement: null,
        fk_epci: null,
        fk_city: null,
        closed_shantytowns: closedTowns,
        exported_by: user.id,
    };

    if (location.type !== 'nation') {
        stat[`fk_${location.type}`] = location[location.type].code;
    }

    try {
        await statsExportsModel.create(stat);
    } catch (error) {
        throw new ServiceError('write_failed', error);
    }

    return buffer;
};
