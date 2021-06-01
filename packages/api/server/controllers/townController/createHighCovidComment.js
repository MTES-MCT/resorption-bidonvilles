const { trim } = require('validator');
const HttpError = require('#server/errors/httpError');
const FormError = require('#server/errors/formError');

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
            throw new HttpError(
                401,
                new FormError(
                    'Vous n\'avez pas les droits nécessaires pour créer un commentaire',
                    'National user can\'t create high covid comments',
                ),
            );
        }

        // users at region/epci level
        let departements;
        if (['region', 'epci'].indexOf(locationType) !== -1) {
            if (body.departements === undefined) {
                throw new HttpError(
                    400,
                    new FormError(
                        'Vous devez désigner les départements concernés par ce commentaire',
                        'Departements are missing',
                    ),
                );
            }
            if (Object.prototype.toString.apply(body.departements) !== '[object Array]') {
                throw new HttpError(
                    400,
                    new FormError(
                        'Vous devez désigner les départements concernés par ce commentaire',
                        'Departements are invalid',
                    ),
                );
            }
            if (body.departements.length === 0) {
                throw new HttpError(
                    400,
                    new FormError(
                        'Vous devez désigner les départements concernés par ce commentaire',
                        'Departements are empty',
                    ),
                );
            }

            const allowedDepartements = (await models.geo.getDepartementsFor(
                locationType,
                user.organization.location[locationType].code,
            )).map(({ code }) => code);

            const badDepartements = body.departements.filter(code => allowedDepartements.indexOf(code) === -1);
            if (badDepartements.length > 0) {
                throw new HttpError(
                    400,
                    new FormError(
                        `Vous ne pouvez pas déposer un commentaire pour le(s) département(s) : ${badDepartements.join(', ')}`,
                        `User tried to create a comment on forbidden departements: ${badDepartements.join(', ')}`,
                    ),
                );
            }

            ({ departements } = body);
        } else { // other users
            departements = [user.organization.location.departement.code];
        }

        if (typeof body.description !== 'string') {
            throw new HttpError(
                400,
                new FormError(
                    'Le commentaire ne peut être vide',
                    `The comment is not a string (got ${typeof body.description})`,
                ),
            );
        }

        // =========== validate the comment itself
        const description = trim(body.description);
        if (description === '') {
            throw new HttpError(
                400,
                new FormError(
                    'Le commentaire ne peut être vide',
                    'The comment is empty',
                ),
            );
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
            return res.status(error.code).send(error.serialize());
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
