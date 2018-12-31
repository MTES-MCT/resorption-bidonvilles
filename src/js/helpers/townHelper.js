/**
 * Handles a response from an API request
 *
 * @param {Function} success
 * @param {Function} failure
 */
function onApiResponse(success, failure) {
    let response = null;
    try {
        response = JSON.parse(this.responseText);
    } catch (error) {
        failure({
            user_message: 'Erreur inconnue',
        });
        return;
    }

    if (this.status !== 200) {
        failure((response && response.error) || {
            user_message: 'Erreur inconnue',
        });
        return;
    }

    success(response);
}

/**
 * Fetches all towns from the database
 *
 * @returns {Promise}
 */
export function all() {
    return new Promise((success, failure) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${process.env.API_URL}/towns`);
        xhr.onload = onApiResponse.bind(xhr, success, failure);
        xhr.send();
    });
}

/**
 * Creates a new town
 *
 * @param {Town_Data} data
 *
 * @returns {Promise}
 */
export function add(data) {
    return new Promise((success, failure) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${process.env.API_URL}/towns`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = onApiResponse.bind(xhr, success, failure);
        xhr.send(JSON.stringify(data));
    });
}

/**
 * @typedef {Object} Town_Data
 * @property {number} latitude,
 * @property {number} longitude,
 * @property {string} address,
 * @property {string} detailed_address,
 * @property {?Date} built_at,
 * @property {?number} population_total,
 * @property {?number} population_couples,
 * @property {?number} population_minors,
 * @property {?boolean} access_to_electricity,
 * @property {?boolean} access_to_water,
 * @property {?boolean} trash_evacuation,
 * @property {Array.<number>} social_origins,
 * @property {number} field_type,
 * @property {number} owner_type,
 */
