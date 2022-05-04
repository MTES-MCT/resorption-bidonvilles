const ServiceError = require('#server/errors/ServiceError');

const permissionUtils = require('#server/utils/permission');
const geoModel = require('#server/models/geoModel');
const geoUtils = require('#server/utils/geo');
const shantytownModel = require('#server/models/shantytownModel');
const closingSolutionModel = require('#server/models/closingSolutionModel');
const excelUtils = require('#server/utils/excel');
const statsExportsModel = require('#server/models/statsExports');
const moment = require('moment');
const serializeShantytown = require('#server/models/shantytownModel/_common/serializeShantytown');


const serializeExportProperties = require('./_common/serializeExportProperties');
const createExportSections = require('./_common/createExportSections');


module.exports = async (user, data) => {
    if (!Object.prototype.hasOwnProperty.call(data, 'locationType')
        || !Object.prototype.hasOwnProperty.call(data, 'locationCode')) {
        throw new ServiceError('data_incomplete', new Error('Le périmètre géographique à exporter est obligatoire'));
    }

    let location;
    try {
        location = await geoModel.getLocation(data.locationType, data.locationCode);
    } catch (error) {
        throw new ServiceError('fetch_failed', new Error('Une erreur est survenue lors de la lecture en base de données'));
    }

    if (!permissionUtils.can(user).do('export', 'shantytown').on(location)) {
        throw new ServiceError('permission_denied', new Error('Vous n\'êtes pas autorisé(e) à exporter le périmètre géographique demandé'));
    }

    const today = new Date();

    if (user.is_superuser === false && moment(data.date).format('YYYY-MM-DD') !== moment(today).format('YYYY-MM-DD')) {
        throw new ServiceError('permission_denied', new Error('Vous n\'êtes pas autorisé(e) à exporter des données passées'));
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
        if (moment(data.date).format('YYYY-MM-DD') === moment(today).format('YYYY-MM-DD')) {
            shantytowns = await shantytownModel.findAll(
                user,
                filters,
                'export',
            );
        } else {
            shantytowns = await shantytownModel.getExportHistory(user, geoModel.getLocation(location.type, location.code), moment(data.date).format('YYYY-MM-DD HH:mm:ss ZZ'));
            const listOfId = [];
            shantytowns = shantytowns.filter(({ id, closed_at }) => {
                if (listOfId.includes(id)) {
                    return false;
                }
                listOfId.push(id);
                if (closedTowns ? closed_at === null : closed_at !== null) {
                    return false;
                }
                return true;
            });
            shantytowns = shantytowns.map(town => serializeShantytown(town, user));
        }
    } catch (error) {
        throw new ServiceError('fetch_failed', new Error('Une erreur est survenue lors de la lecture en base de données'));
    }

    if (shantytowns.length === 0) {
        throw new ServiceError('fetch_failed', new Error('Il n\'y a aucun site à exporter pour le périmètre géographique demandé'));
    }

    let closingSolutions;
    try {
        closingSolutions = await closingSolutionModel.findAll();
    } catch (error) {
        throw new ServiceError('fetch_failed', new Error('Une erreur est survenue lors de la lecture en base de données'));
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
        throw new ServiceError('write_failed', new Error('Une erreur est survenue lors de l\'écriture en base de données'));
    }

    return buffer;
};
