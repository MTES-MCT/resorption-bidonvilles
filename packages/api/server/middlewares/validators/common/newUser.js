/* eslint-disable newline-per-chained-call */
const { body } = require('express-validator');

// models
const { sequelize } = require('#db/models');
const organizationCategoryModel = require('#server/models/organizationCategoryModel')(sequelize);
const organizationTypeModel = require('#server/models/organizationTypeModel')(sequelize);
const organizationModel = require('#server/models/organizationModel')(sequelize);
const departementModel = require('#server/models/departementModel')(sequelize);
const userModel = require('#server/models/userModel')(sequelize);

module.exports = (additionalValidators = [], isAUserCreationCallback = (() => true)) => ([
    ...additionalValidators,

    body('last_name')
        .trim()
        .notEmpty().withMessage('Vous devez préciser le nom'),

    body('first_name')
        .trim()
        .notEmpty().withMessage('Vous devez préciser le prénom'),

    body('email')
        .trim()
        .notEmpty().withMessage('Vous devez préciser le courriel')
        .isEmail().withMessage('Ce courriel n\'est pas valide')
        .normalizeEmail({
            gmail_remove_dots: false,
            gmail_remove_subaddress: false,
            gmail_convert_googlemaildotcom: false,
            outlookdotcom_remove_subaddress: false,
            yahoo_remove_subaddress: false,
            icloud_remove_subaddress: false,
        })
        .if(isAUserCreationCallback)
        .custom(async (value, { req }) => {
            let user = null;
            try {
                user = await userModel.findOneByEmail(value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la vérification du courriel');
            }

            if (user !== null) {
                throw new Error('Un utilisateur existe déjà pour ce courriel');
            }

            req.body.user_full = user;
            return true;
        }),

    body('phone')
        .optional()
        .isString()
        .trim()
        .custom((value) => {
            if (!value) {
                return true;
            }

            const frenchPhoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/gmi;
            const match = value.match(frenchPhoneRegex);

            if (!match) {
                throw new Error('Le téléphone est invalide');
            }

            return true;
        }),

    body('organization_category')
        .if(isAUserCreationCallback)
        .custom(async (value, { req }) => {
            if (!value) {
                throw new Error('Vous devez préciser la structure');
            }

            let organizationCategory;
            try {
                organizationCategory = await organizationCategoryModel.findOneById(value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la vérification de la structure');
            }

            if (organizationCategory === null) {
                throw new Error('La structure que vous avez sélectionnée n\'existe pas en base de données');
            }

            req.body.organization_category_full = organizationCategory;
            return true;
        }),

    body('organization_type')
        .toInt()
        .if((value, { req }) => req.body.organization_category_full.uid === 'public_establishment')
        .custom(async (value, { req }) => {
            if (!value) {
                throw new Error('Vous devez préciser le type de structure');
            }

            let organizationType;
            try {
                organizationType = await organizationTypeModel.findOneById(value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la vérification du type de structure');
            }

            if (organizationType === null) {
                throw new Error('Le type de structure que vous avez sélectionné n\'existe pas en base de données');
            }

            if (organizationType.organization_category !== 'public_establishment') {
                throw new Error('Le type de structure que vous avez sélectionné est invalide');
            }

            req.body.organization_type_full = organizationType;
            return true;
        }),

    body('organization_public')
        .toInt()
        .if((value, { req }) => req.body.organization_type_full !== undefined)
        .custom(async (value, { req }) => {
            if (!value) {
                throw new Error('Vous devez préciser le territoire de rattachement de la structure');
            }

            let organization;
            try {
                organization = await organizationModel.findOneById(value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la vérification du territoire de rattachement');
            }

            if (organization === null) {
                throw new Error('Le territoire de rattachement que vous avez sélectionné n\'existe pas en base de données');
            }

            if (organization.fk_type !== req.body.organization_type) {
                throw new Error('Le territoire de rattachement que vous avez sélectionné est invalide');
            }

            req.body.organization_full = organization;
            return true;
        }),

    body('territorial_collectivity')
        .if((value, { req }) => req.body.organization_category_full.uid === 'territorial_collectivity')
        .custom(async (value, { req }) => {
            if (!value) {
                throw new Error('Vous devez préciser le nom de la structure');
            }

            let organization;
            try {
                organization = await organizationModel.findOneByLocation(
                    value.category,
                    value.data.type,
                    value.data.code,
                );
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la vérification du nom de la structure');
            }

            if (organization === null) {
                throw new Error('Le nom de structure que vous avez sélectionné n\'existe pas en base de données');
            }

            if (organization.fk_category !== 'territorial_collectivity') {
                throw new Error('Le nom de structure que vous avez sélectionné est invalide');
            }

            req.body.organization_full = organization;
            return true;
        }),

    body('organization_administration')
        .if((value, { req }) => req.body.organization_category_full.uid === 'administration')
        .custom(async (value, { req }) => {
            if (!value) {
                throw new Error('Vous devez préciser le nom de la structure');
            }

            let organization;
            try {
                organization = await organizationModel.findOneById(value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la vérification du nom de la structure');
            }

            if (organization === null) {
                throw new Error('Le nom de structure que vous avez sélectionné n\'existe pas en base de données');
            }

            if (organization.fk_category !== 'administration') {
                throw new Error('Le nom de structure que vous avez sélectionné est invalide');
            }

            req.body.organization_full = organization;
            return true;
        }),

    body('association')
        .if((value, { req }) => req.body.organization_category_full.uid === 'association')
        .custom(async (value, { req }) => {
            if (!value) {
                throw new Error('Vous devez préciser le nom de la structure');
            }

            if (value === 'Autre') {
                return true;
            }

            let organization;
            try {
                organization = await organizationModel.findAssociationName(value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la vérification du nom de la structure');
            }

            if (organization === null) {
                throw new Error('Le nom de structure que vous avez sélectionné n\'existe pas en base de données');
            }

            req.body.association_name = organization.name;
            req.body.association_abbreviation = organization.abbreviation;

            return true;
        }),

    body('new_association_name')
        .if((value, { req }) => req.body.organization_category_full.uid === 'association' && req.body.association === 'Autre')
        .trim()
        .custom(async (value) => {
            if (!value) {
                throw new Error('Vous devez préciser le nom complet de l\'association');
            }

            let organization;
            try {
                organization = await organizationModel.findAssociationName(value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la vérification du nom de la structure');
            }

            if (organization !== null) {
                throw new Error('Il existe déjà une association enregistrée sous ce nom');
            }

            return true;
        }),

    body('new_association_abbreviation')
        .if((value, { req }) => req.body.organization_category_full.uid === 'association' && req.body.association === 'Autre')
        .trim(),

    body('departement')
        .if((value, { req }) => req.body.organization_category_full.uid === 'association')
        .custom(async (value, { req }) => {
            if (!value) {
                throw new Error('Vous devez préciser le territoire de rattachement');
            }

            // check the departement
            let departement;
            try {
                departement = await departementModel.findOne(value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la vérification du département');
            }

            if (departement === null) {
                throw new Error('Le territoire de rattachement que vous avez sélectionné n\'existe pas en base de données');
            }

            // case of an existing association
            if (req.body.association !== 'Autre') {
                let association = null;
                try {
                    association = await organizationModel.findOneAssociation(
                        req.body.association,
                        value,
                    );
                } catch (error) {
                    throw new Error('Une erreur est survenue lors de la vérification du territoire de rattachement');
                }

                if (association !== null) {
                    req.body.new_association = false;
                    req.body.organization_full = association;
                } else {
                    req.body.new_association = true;
                    req.body.new_association_name = req.body.association_name;
                    req.body.new_association_abbreviation = req.body.association_abbreviation;
                }

                return true;
            }

            // case of a brand new association
            req.body.new_association = true;
            return true;
        }),

    body('position')
        .if(isAUserCreationCallback)
        .trim()
        .notEmpty().withMessage('Vous devez préciser la fonction au sein de la structure'),

    body('legal')
        .custom((value) => {
            if (value !== true) {
                throw new Error('Vous devez certifier que ces données personnelles ont été saisies avec l\'accord de leur propriétaire');
            }

            return true;
        }),
]);
