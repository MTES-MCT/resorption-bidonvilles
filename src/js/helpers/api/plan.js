import { postApi } from '#helpers/api/main';

/**
 * Creates a new plan
 *
 * @param {Object} data
 *
 * @returns {Promise}
 */
export function create(data) {
    return new Promise((success, failure) => {
        setTimeout(() => {
            // success();
            failure({
                error: {
                    user_message: 'Une erreur est survenue',
                    fields: {
                        operator: ['L\'opérateur est invalide'],
                        planType: ['Le type de  dispositif est invalide'],
                        planTypeOther: ['La précision est invalide'],
                        startedAt: ['La date est invalide'],
                    },
                },
            });
        }, 500);
    });
    // return postApi('/plans', data);
}

export default create;
