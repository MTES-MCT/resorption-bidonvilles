const validator = require('validator');
const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');


function addError(errors, field, error) {
    if (!Object.prototype.hasOwnProperty.call(errors, field)) {
        // eslint-disable-next-line no-param-reassign
        errors[field] = [];
    }

    errors[field].push(error);
}

module.exports = async (user, shantytownId, data) => {
    // ensure town's existence
    let shantytown;
    try {
        shantytown = await shantytownModel.findOne(user, shantytownId);
    } catch (error) {
        throw new ServiceError('fetch_failed', new Error(`Une erreur est survenue lors de la vérification de l'existence du site #${shantytownId} en base de données`));
    }

    if (shantytown === null) {
        throw new ServiceError('shantytown_unfound', new Error(`Le site #${shantytownId} n'existe pas`));
    }
    // sanitize input
    function sanitize(body) {
        const date = new Date(body.date);
        const sanitizedBody = {
            date: typeof body.date === 'string' && !Number.isNaN(date.getTime()) ? date : null,
            description: typeof body.description === 'string' ? validator.trim(body.description) : null,
        };

        ['personnes_orientees', 'personnes_avec_symptomes',
            'besoin_action', 'action_mediation_sante', 'sensibilisation_vaccination', 'equipe_mobile_depistage', 'equipe_mobile_vaccination']
            .forEach((name) => {
                sanitizedBody[name] = typeof body[name] === 'boolean' ? body[name] : null;
            });

        return sanitizedBody;
    }

    const sanitizedData = sanitize(data);

    // validate input
    const labels = {
        date: 'La date',
        action_mediation_sante: 'Le champ "Action de médiation en santé"',
        sensibilisation_vaccination: 'Le champ "Sensibilisation à la vaccination"',
        equipe_mobile_depistage: 'Le champ "Équipe mobile de dépistage"',
        equipe_mobile_vaccination: 'Le champ "Équipe mobile de vaccination"',
        personnes_orientees: 'Le champ "Personne(s) orientée(s) vers un centre d\'hébergement spécialisé (desserrement)"',
        personnes_avec_symptomes: 'Le champ "Personnes avec des symptômes Covid-19"',
        besoin_action: 'Le champ "Besoin d\'une action prioritaire"',
        description: 'Le commentaire',
    };
    const errors = {};

    Object.keys(sanitizedData).forEach((name) => {
        if (sanitizedData[name] === null) {
            addError(errors, name, `${labels[name]} est obligatoire`);
        }
    });

    if (sanitizedData.date !== null) {
        // date can't be future
        const today = new Date();
        if (sanitizedData.date > today) {
            addError(errors, 'date', 'La date ne peut être future');
        }

        // date can't be older than the town's declaration date
        if (sanitizedData.date < new Date(shantytown.builtAt * 1000)) {
            addError(errors, 'date', 'La date ne peut être antérieure à la date d\'installation du site');
        }
    }

    if (sanitizedData.description === '') {
        addError(errors, 'description', 'Le commentaire est obligatoire');
    }

    if (Object.keys(errors).length > 0) {
        throw new ServiceError('data_incomplete', new Error('Certains champs du formulaire comportent des erreurs'));
    }

    // try creating the new comment
    try {
        await shantytownModel.createCovidComment(user, shantytownId, sanitizedData);
    } catch (error) {
        throw new ServiceError('write_failed', new Error('Une erreur est survenue lors de l\'écriture du commentaire en base de données'));
    }

    // fetch refreshed comments
    let comments;
    try {
        const response = await shantytownModel.getComments(user, [shantytownId], true);
        comments = response[shantytownId];
    } catch (error) {
        comments = [];
    }

    return comments;
};
