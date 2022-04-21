const ServiceError = require('#server/errors/ServiceError');

const permissionUtils = require('#server/utils/permission');
const geoModel = require('#server/models/geoModel');
const geoUtils = require('#server/utils/geo');
const shantytownModel = require('#server/models/shantytownModel');
const closingSolutionModel = require('#server/models/closingSolutionModel');
const excelUtils = require('#server/utils/excel');
const statsExportsModel = require('#server/models/statsExports');


const serializeExportProperties = require('./_common/serializeExportProperties');
const createExportSections = require('./_common/createExportSections');


module.exports = async (user, data) => {
    if (!Object.prototype.hasOwnProperty.call(data, 'locationType')
        || !Object.prototype.hasOwnProperty.call(data, 'locationCode')) {
        throw new ServiceError('data_incomplete', {
            user_message: 'Le périmètre géographique à exporter est obligatoire',
            developer_message: 'locationType and/or locationCode are missing',
        });
    }

    let location;
    try {
        location = await geoModel.getLocation(data.locationType, data.locationCode);
    } catch (error) {
        throw new ServiceError('fetch_failed', {
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
            developer_message: 'could not get location',
        });
    }

    if (!permissionUtils.can(user).do('export', 'shantytown').on(location)) {
        throw new ServiceError('permission_denied', {
            user_message: 'Vous n\'êtes pas autorisé(e) à exporter le périmètre géographique demandé',
            developer_message: 'the requested location is not allowed to current user',
        });
    }

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
        const locationFilters = {
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
        shantytowns = await shantytownModel.findAll(
            user,
            filters,
            'export',
        );
    } catch (error) {
        throw new ServiceError('fetch_failed', {
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
            developer_message: 'Failed to fetch towns',
        });
    }

    if (shantytowns.length === 0) {
        throw new ServiceError('fetch_failed', {
            user_message: 'Il n\'y a aucun site à exporter pour le périmètre géographique demandé',
            developer_message: 'no shantytown to be exported',
        });
    }

    let closingSolutions;
    try {
        closingSolutions = await closingSolutionModel.findAll();
    } catch (error) {
        throw new ServiceError('fetch_failed', {
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
            developer_message: 'Failed to fetch closing solutions',
        });
    }

    const properties = serializeExportProperties(closingSolutions);
    const sections = createExportSections(user, data, properties, closedTowns, closingSolutions);
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

    try {
        await statsExportsModel.create(stat);
    } catch (error) {
        throw new ServiceError('write_failed', {
            user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
            developer_message: 'Failed to store statistics',
        });
    }

    return buffer;
};
