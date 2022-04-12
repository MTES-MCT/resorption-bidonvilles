/* eslint-disable no-throw-literal */
const { trim } = require('validator');
const geoModel = require('#server/models/geoModel');


module.exports = (models) => {
    /**
     * Parses the request input and returns it sanitized and ready for database
     *
     * @param {User}   user
     * @param {Object} body Body of the request
     *
     * @returns {Object}
     */
    async function sanitizeInput(user, body) {
        // =========== resolve the departements for the new comment
        const { type: locationType } = user.organization.location;

        // national users
        if (locationType === 'nation') {
            throw {
                code: 401,
                error: {
                    user_message: 'Vous n\'avez pas les droits nécessaires pour créer un commentaire',
                },
            };
        }

        // users at region/epci level
        let departements;
        if (['region', 'epci'].indexOf(locationType) !== -1) {
            if (body.departements === undefined) {
                throw {
                    code: 400,
                    error: {
                        user_message: 'Vous devez désigner les départements concernés par ce commentaire',
                    },
                };
            }
            if (Object.prototype.toString.apply(body.departements) !== '[object Array]') {
                throw {
                    code: 400,
                    error: {
                        user_message: 'Vous devez désigner les départements concernés par ce commentaire',
                    },
                };
            }
            if (body.departements.length === 0) {
                throw {
                    code: 400,
                    error: {
                        user_message: 'Vous devez désigner les départements concernés par ce commentaire',
                    },
                };
            }

            const allowedDepartements = (await geoModel.getDepartementsFor(
                locationType,
                user.organization.location[locationType].code,
            )).map(({ code }) => code);

            const badDepartements = body.departements.filter(code => allowedDepartements.indexOf(code) === -1);
            if (badDepartements.length > 0) {
                throw {
                    code: 400,
                    error: {
                        user_message: `Vous ne pouvez pas déposer un commentaire pour le(s) département(s) : ${badDepartements.join(', ')}`,
                    },
                };
            }

            ({ departements } = body);
        } else { // other users
            departements = [user.organization.location.departement.code];
        }

        if (typeof body.description !== 'string') {
            throw {
                code: 400,
                error: {
                    user_message: 'Le commentaire ne peut être vide',
                },
            };
        }

        // =========== validate the comment itself
        const description = trim(body.description);
        if (description === '') {
            throw {
                code: 400,
                error: {
                    user_message: 'Le commentaire ne peut être vide',
                },
            };
        }

        return {
            departements,
            description,
        };
    }

    /**
     * Creates a high covid comment
     */
    return async (req, res, next) => {
        // validate input
        let input;
        try {
            input = await sanitizeInput(req.user, req.body);
        } catch (error) {
            return res.status(error.code).send(error.error);
        }

        // create comment
        try {
            await models.highCovidComment.create(req.user, input);
        } catch (error) {
            res.status(500).send({
                user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
                developer_message: `Failed saving the comment into database: ${error.message}`,
            });
            return next(error);
        }

        // respond
        return res.status(204).send({});
    };
};
