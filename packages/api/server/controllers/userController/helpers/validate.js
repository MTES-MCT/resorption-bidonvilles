const { isEmail } = require('validator');
const checkPassword = require('#server/controllers/userController/helpers/checkPassword');
const { sequelize } = require('#db/models/index');
const userModel = require('#server/models/userModel')(sequelize);
const organizationCategoryModel = require('#server/models/organizationCategoryModel')(sequelize);
const organizationTypeModel = require('#server/models/organizationTypeModel')(sequelize);
const organizationModel = require('#server/models/organizationModel')(sequelize);
const departementModel = require('#server/models/departementModel')(sequelize);

class MultipleError extends Error {
    constructor(messages, ...args) {
        super('Plusieurs erreurs sont survenues', ...args);
        this.messages = messages;
    }
}

const validators = {
    last_name(data) {
        if (data.last_name === null || data.last_name === '') {
            throw new Error('Le nom est obligatoire');
        }
    },

    first_name(data) {
        if (data.first_name === null || data.first_name === '') {
            throw new Error('Le prénom est obligatoire');
        }
    },

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

    async organization_category(data) {
        if (data.organization_category === null) {
            throw new Error('La structure est obligatoire');
        }

        let category = null;
        try {
            category = await organizationCategoryModel.findOneById(data.organization_category);
        } catch (error) {
            throw new Error('Une erreur est survenue lors de la vérification de la structure sélectionnée');
        }

        if (category === null) {
            throw new Error('La structure sélectionnée n\'existe pas en base de données');
        }
    },

    position(data) {
        if (data.position === null || data.position === '') {
            throw new Error('La fonction est obligatoire');
        }
    },

    phone(data) {
        if (data.phone === null || data.phone === '') {
            return;
        }

        if (!/^0[0-9]{9}$/g.test(data.phone)) {
            throw new Error('Le téléphone doit être une suite de 10 chiffres');
        }
    },

    password(data) {
        if (data.password === null || data.password === '') {
            throw new Error('Le mot de passe est obligatoire');
        }

        const passwordErrors = checkPassword(data.password);
        if (passwordErrors.length > 0) {
            throw new MultipleError(passwordErrors);
        }
    },

    access_request_message(data) {
        if (data.access_request_message === null || data.access_request_message === '') {
            throw new Error('Le message est obligatoire');
        }
    },

    legal(data) {
        if (data.legal !== true) {
            throw new Error('Vous devez confirmer que les données saisies l\'ont été avec votre accord');
        }
    },

    async organization_type(data) {
        if (data.organization_type === null) {
            throw new Error('Le type de structure est obligatoire');
        }

        let type = null;
        try {
            type = await organizationTypeModel.findOneById(data.organization_type);
        } catch (error) {
            throw new Error('Une erreur est survenue lors de la vérification du type de structure sélectionné');
        }

        if (type === null) {
            throw new Error('Le type de structure sélectionné n\'existe pas en base de données');
        }

        if (type.organization_category !== data.organization_category) {
            throw new Error('La structure et le type de structure sélectionnés ne se correspondent pas');
        }
    },

    async organization_public(data) {
        if (data.organization_public === null) {
            throw new Error('Le territoire de rattachement est obligatoire');
        }

        let organization = null;
        try {
            organization = await organizationModel.findOneById(data.organization_public);
        } catch (error) {
            throw new Error('Une erreur est survenue lors de la vérification du territoire de rattachement');
        }

        if (organization === null) {
            throw new Error('Le territoire de rattachement sélectionné n\'existe pas en base de données');
        }

        if (organization.fk_type !== data.organization_type) {
            throw new Error('Le territoire de rattachement sélectionné ne correspond à aucune structure en base de données');
        }

        Object.assign(data, { organization: organization.id });
    },

    async territorial_collectivity(data) {
        if (data.territorial_collectivity === null) {
            throw new Error('Le nom de la structure est obligatoire');
        }

        let organization = null;
        try {
            organization = await organizationModel.findOneByLocation(
                data.territorial_collectivity.category,
                data.territorial_collectivity.data.type,
                data.territorial_collectivity.data.code,
            );
        } catch (error) {
            throw new Error('Une erreur est survenue lors de la vérification du nom de la structure');
        }

        if (organization === null) {
            throw new Error('La structure sélectionnée n\'existe pas en base de données');
        }

        if (organization.fk_category !== data.organization_category) {
            throw new Error('La structure sélectionnée n’est pas une collectivité territoriale');
        }

        Object.assign(data, { organization: organization.id });
    },

    async organization_administration(data) {
        if (data.organization_administration === null) {
            throw new Error('Le nom de la structure est obligatoire');
        }

        let organization = null;
        try {
            organization = await organizationModel.findOneById(data.organization_administration);
        } catch (error) {
            throw new Error('Une erreur est survenue lors de la vérification du nom de la structure');
        }

        if (organization === null) {
            throw new Error('La structure sélectionnée n\'existe pas en base de données');
        }

        if (organization.fk_category !== data.organization_category) {
            throw new Error('La structure sélectionnée n’est pas une administration centrale');
        }

        Object.assign(data, { organization: organization.id });
    },

    async association(data) {
        if (data.association === null || data.association === '') {
            throw new Error('Le nom de la structure est obligatoire');
        }

        if (data.association === 'Autre') {
            return;
        }

        let association;
        try {
            association = await organizationModel.findAssociationName(data.association);
        } catch (error) {
            throw new Error('Une erreur est survenue lors de la vérification du nom de l\'association');
        }

        if (association === null) {
            throw new Error('L\'association sélectionnée n\'a pas été trouvée en base de données');
        }
    },

    async newAssociationName(data) {
        if (data.association !== 'Autre') {
            return;
        }

        if (data.newAssociationName === null || data.newAssociationName === '') {
            throw new Error('Le nom complet de l\'association est obligatoire');
        }

        let association;
        try {
            association = await organizationModel.findAssociationName(data.newAssociationName);
        } catch (error) {
            throw new Error('Une erreur est survenue lors de la vérification du nom complet de l\'association');
        }

        if (association !== null) {
            throw new Error('Il existe déjà une association enregistrée sous ce nom');
        }
    },

    newAssociationAbbreviation() { },

    async departement(data) {
        if (data.departement === null) {
            throw new Error('Le territoire de rattachement est obligatoire');
        }

        let departement;
        try {
            departement = await departementModel.findOne(data.departement);
        } catch (error) {
            throw new Error('Une erreur est survenue lors de la vérification du territoire de rattachement');
        }

        if (departement === null) {
            throw new Error('Le terrtoire de rattachement sélectionné n\'existe pas en base de données');
        }
    },
};

module.exports = async function validate(data, fields) {
    const errors = {};

    for (let i = 0; i < fields.length; i += 1) {
        const { key, validatorOptions } = fields[i];

        try {
            // eslint-disable-next-line no-await-in-loop
            await validators[key].apply(validators, [data, ...(validatorOptions || [])]);
        } catch (error) {
            if (error instanceof MultipleError) {
                errors[key] = error.messages;
            } else {
                errors[key] = [error.message];
            }
        }
    }

    return errors;
};
