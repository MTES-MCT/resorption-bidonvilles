import { RawInterventionArea } from '#server/models/userModel/_common/query.d';
import { InterventionArea } from '#server/models/geoModel/Location.d';

export default (area: RawInterventionArea): InterventionArea => {
    const {
        type,
        is_main_area: isMainArea,
        region_code: regionCode,
        region_name: regionName,
        departement_code: departementCode,
        departement_name: departementName,
        epci_code: epciCode,
        epci_name: epciName,
        city_code: cityCode,
        city_name: cityName,
        city_main: cityMain,
        latitude,
        longitude,
    } = area;
    const region = regionCode ? { code: regionCode, name: regionName } : null;
    const departement = departementCode ? { code: departementCode, name: departementName } : null;
    const epci = epciCode ? { code: epciCode, name: epciName } : null;
    const city = cityCode ? { code: cityCode, name: cityName, main: cityMain } : null;

    if (type === 'nation') {
        return {
            type: 'nation',
            is_main_area: isMainArea,
            latitude: 46.7755829,
            longitude: 2.0497727,
            region: null,
            departement: null,
            epci: null,
            city: null,
        };
    }

    if (type === 'region') {
        return {
            type: 'region',
            is_main_area: isMainArea,
            latitude,
            longitude,
            region,
            departement: null,
            epci: null,
            city: null,
        };
    }

    if (type === 'departement') {
        return {
            type: 'departement',
            is_main_area: isMainArea,
            latitude,
            longitude,
            region,
            departement,
            epci: null,
            city: null,
        };
    }

    if (type === 'epci') {
        return {
            type: 'epci',
            is_main_area: isMainArea,
            latitude,
            longitude,
            region,
            departement,
            epci,
            city: null,
        };
    }

    return {
        type: 'city',
        is_main_area: isMainArea,
        latitude,
        longitude,
        region,
        departement,
        epci,
        city,
    };
};
