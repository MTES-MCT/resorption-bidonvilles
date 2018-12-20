/**
 * Computes the unique identifier of the given feature
 *
 * @param {Object} feature
 *
 * @returns {string}
 */
function computeUid(feature) {
    return `${feature.geometry.coordinates[0]}-${feature.geometry.coordinates[1]}`;
}

/**
 * Removes duplicate features from the given array of features
 *
 * @param {Array.<Object>} features
 *
 * @returns {Array.<Object>}
 */
function removeDuplicates(features) {
    const usedUids = [];

    return features.filter((feature) => {
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
            removeDuplicates(features).map(feature => ({
                label: `${feature.properties.label}, ${feature.properties.context}`,
                coordinates: feature.geometry.coordinates,
            })),
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

        xhr.open('GET', `https://api-adresse.data.gouv.fr/search/?${queries.join('&')}`);
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

export default autocomplete;
