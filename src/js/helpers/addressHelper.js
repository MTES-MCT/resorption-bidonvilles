import { getApi } from "#helpers/api/main";

/**
 * Computes the unique identifier of the given feature
 *
 * @param {Feature} feature
 *
 * @returns {string}
 */
function computeUid(feature) {
    return `${feature.geometry.coordinates[0]}-${feature.geometry.coordinates[1]}`;
}

/**
 * Removes duplicate features from the given array of features
 *
 * @param {Array.<Feature>} features
 *
 * @returns {Array.<Feature>}
 */
function removeDuplicates(features) {
    const usedUids = [];

    return features.filter(feature => {
        const uid = computeUid(feature);
        if (usedUids.indexOf(uid) !== -1) {
            return false;
        }

        usedUids.push(uid);
        return true;
    });
}

/**
 * Handles the response of an autocomplete request
 *
 * @param {Function} success Success callback
 * @param {Function} failure Failure callback
 */
function onAutocompleteLoad(success, failure) {
    if (this.status !== 200) {
        failure();
        return;
    }

    try {
        const { features } = JSON.parse(this.responseText);
        success(
            removeDuplicates(features)
                .filter(
                    feature => feature.properties && feature.properties.citycode
                )
                .map(feature => ({
                    addressType: feature.properties.type,
                    citycode: feature.properties.citycode,
                    city: feature.properties.city,
                    coordinates: feature.geometry.coordinates,
                    id: feature.properties.id,
                    label: `${feature.properties.label}, ${feature.properties.context}`,
                    category: "address",
                    data: {
                        citycode: feature.properties.citycode,
                        city: feature.properties.city,
                        label: `${feature.properties.label}, ${feature.properties.context}`,
                        coordinates: feature.geometry.coordinates
                    }
                }))
        );
    } catch (error) {
        failure();
    }
}

/**
 * Returns autocompletion suggestion for the given address
 *
 * Based on https://adresse.data.gouv.fr/api
 *
 * @param {string} strSearch The string to be autocompleted
 * @param {number} limit     The maximum number of suggestions to be returned
 *
 * @returns {Promise}
 */
export function autocomplete(strSearch, limit = 5) {
    const xhr = new XMLHttpRequest();
    const promise = new Promise((success, failure) => {
        const queries = [`q=${encodeURIComponent(strSearch)}`];

        const parsedLimit = parseInt(limit, 10);
        if (!Number.isNaN(parsedLimit)) {
            queries.push(`limit=${parsedLimit}`);
        }

        xhr.open(
            "GET",
            `https://api-adresse.data.gouv.fr/search/?${queries.join("&")}`
        );
        xhr.onload = onAutocompleteLoad.bind(xhr, success, failure);
        xhr.onerror = failure;
        xhr.ontimeout = failure;
        xhr.send();
    });
    promise.abort = () => {
        xhr.abort();
    };

    return promise;
}

/**
 * Searches for cities/epcis/departements
 *
 * @param {string} strSearch The string to be autocompleted
 *
 * @returns {Promise}
 */
export function autocompleteLocation(strSearch) {
    const p1 = getApi(`/locations/search?q=${encodeURIComponent(strSearch)}`);
    const p2 = p1.then(results =>
        results.map(result => ({
            label:
                result.code.length === 5
                    ? `(${result.code.slice(0, 2)}) ${result.name}`
                    : result.name,
            code: result.code,
            type: result.label,
            locationType: result.type
        }))
    );
    p2.abort = p1.abort;
    return p2;
}

/**
 * Lists all departements
 *
 * @returns {Promise}
 */
export function departements() {
    return getApi("/departements");
}

/**
 * @typedef {Object} Feature
 * @property {Feature_Properties} properties
 * @property {Feature_Geometry}   geometry
 */

/**
 * @typedef {Object} Feature_Properties
 * @property {string} label
 * @property {string} context
 */

/**
 * @typedef {Object} Feature_Geometry
 * @property {Array.<number>} coordinates An array of two double numbers, ie. the latitude and longitude
 */

/**
 * @typedef {Suggestion}
 * @property {string}         label
 * @property {Array.<number>} coordinates
 */

/**
 * @typedef {Object} Address
 * @property {String}      id
 * @property {String}      label
 * @property {AddressData} data
 */

/**
 * @typedef {Object} AddressData
 * @property {String} citycode
 * @property {String} city
 * @property {String} label
 * @property {Point}  coordinates
 */

export default autocomplete;
