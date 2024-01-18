import validator from 'validator';
import userModel from '#server/models/userModel';

const { isEmail } = validator;

const validators = {
    async email(data, checkUnicity = true) {
        if (data.email === null || data.email === '') {
            throw new Error('Le courriel est obligatoire');
        }

        if (!isEmail(data.email)) {
            throw new Error('Le courriel est invalide');
        }

        if (checkUnicity === true) {
            let user = null;
            try {
                user = await userModel.findOneByEmail(data.email);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la vérification de votre courriel');
            }

            if (user !== null) {
                throw new Error('Un utilisateur existe déjà pour ce courriel');
            }
        }
    },
};

export default async function validate(data, fields) {
    const errors = {};

    for (let i = 0; i < fields.length; i += 1) {
        const { key, validatorOptions } = fields[i];

        try {
            // eslint-disable-next-line no-await-in-loop
            await validators[key].apply(validators, [data, ...(validatorOptions || [])]);
        } catch (error) {
            errors[key] = [error.message];
        }
    }

    return errors;
}
