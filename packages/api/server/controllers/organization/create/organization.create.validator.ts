/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator';
import geoModel from '#server/models/geoModel';
import organizationCategoryModel from '#server/models/organizationCategoryModel';
import organizationModel from '#server/models/organizationModel';
import organizationTypeModel from '#server/models/organizationTypeModel';
import roleModel from '#server/models/roleModel';
import toSnakeCase from '#server/utils/toSnakeCase';
import { Location } from '#server/models/geoModel/Location.d';

export default [
    body('name')
        .isString().withMessage('Le nom de la structure doit être un texte')
        .trim()
        .notEmpty().withMessage('Le nom de la structure est obligatoire')
        .custom(async (value) => {
            let similarOrganizations: Awaited<ReturnType<typeof organizationModel.findByName>>;
            try {
                similarOrganizations = await organizationModel.findByName(value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la vérification que cette structure n\'existe pas déjà');
            }

            if (similarOrganizations.length > 0) {
                throw new Error(
                    `Il existe déjà une ou des structures portant ce nom : ${similarOrganizations.map(({ name }) => name).join(',')}`,
                );
            }

            return true;
        })
        .isLength({ max: 250 }).bail().withMessage('Le champ "Nom de la structure" ne peut excéder 250 caractères'),

    body('abbreviation')
        .optional({ nullable: true })
        .isString().withMessage('L\'acronyme de la structure doit être un texte')
        .trim()
        .isLength({ max: 250 }).bail().withMessage('Le champ "Acronyme" ne peut excéder 250 caractères'),
    body('abbreviation')
        .customSanitizer(value => value || null),

    body('type')
        .if(value => value !== 'new')
        .toInt()
        .isInt().withMessage('Le type de structure doit être un nombre')
        .custom(async (value, { req }) => {
            let organizationType: Awaited<ReturnType<typeof organizationTypeModel.findOneById>>;
            try {
                organizationType = await organizationTypeModel.findOneById(value as number);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la vérification du type de la structure');
            }

            if (organizationType === null) {
                throw new Error('Le type de structure sélectionné n\'existe pas en base de données');
            }

            req.organizationType = organizationType;
            return true;
        }),

    body('new_type_category')
        .if((value, { req }) => req.body.type === 'new')
        .isString().withMessage('La catégorie du nouveau type de structure doit être un texte')
        .custom(async (value, { req }) => {
            let organizationCategory: Awaited<ReturnType<typeof organizationCategoryModel.findOneById>>;
            try {
                organizationCategory = await organizationCategoryModel.findOneById(value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la vérification de la catégorie du nouveau type de structure');
            }

            if (organizationCategory === null) {
                throw new Error('La catégorie sélectionnée pour le nouveau type de structure n\'existe pas en base de données');
            }

            req.organizationCategory = organizationCategory;
            return true;
        }),


    body('new_type_name')
        .if((value, { req }) => req.body.type === 'new')
        .isString().withMessage('Le nom du nouveau type de structure doit être un texte')
        .trim()
        .notEmpty().withMessage('Le nom du nouveau type de structure est obligatoire')
        .custom(async (value) => {
            const uid = toSnakeCase(value);

            let similarOrganizationType: Awaited<ReturnType<typeof organizationTypeModel.findOneByUid>>;
            try {
                similarOrganizationType = await organizationTypeModel.findOneByUid(uid);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la vérification que cette structure n\'existe pas déjà');
            }

            if (similarOrganizationType !== null) {
                throw new Error(
                    `Il existe déjà un ou des type(s) de structure portant ce nom : ${similarOrganizationType.name}`,
                );
            }

            return true;
        })
        .isLength({ max: 250 }).bail().withMessage('Le champ "Nom du nouveau type de structure" ne peut excéder 250 caractères'),

    body('new_type_abbreviation')
        .if((value, { req }) => req.body.type === 'new')
        .optional({ nullable: true })
        .isString().withMessage('L\'acronyme du nouveau type de structure doit être un texte')
        .trim()
        .isLength({ max: 250 }).bail().withMessage('Le champ "Acronyme du nouveau type de structure" ne peut excéder 250 caractères'),
    body('new_type_abbreviation')
        .customSanitizer(value => value || null),

    body('new_type_default_role')
        .if((value, { req }) => req.body.type === 'new')
        .isString().withMessage('Le rôle par défaut pour le nouveau type de structure doit être un texte')
        .custom(async (value, { req }) => {
            let role: Awaited<ReturnType<typeof roleModel.findOne>>;
            try {
                role = await roleModel.findOne(value, 'regular');
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la vérification du rôle par défaut du nouveau type de structure');
            }

            if (role === null) {
                throw new Error('Le rôle par défaut sélectionné pour le nouveau type de structure n\'existe pas en base de données');
            }

            req.role = role;
            return true;
        }),

    body('intervention_areas')
        .isArray({ min: 1 }).withMessage('Vous devez préciser un ou plusieurs territoires d\'intervention')
        .custom(async (value, { req }) => {
            let locations: Location[];
            try {
                locations = await Promise.all(
                    value.map(({ code, type }) => geoModel.getLocation(type, code)),
                );
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la vérification des territoires d\'intervention');
            }

            const errors = locations.reduce((acc, v, index) => {
                if (v !== null) {
                    return acc;
                }

                acc.push(v[index]?.name || 'nom inconnu');
                return acc;
            }, []);
            if (errors.length > 0) {
                throw new Error(`Les territoires d'intervention suivantes n'ont pas été retrouvées en base de données : ${errors.join(', ')}`);
            }

            req.interventionAreas = locations;
            return true;
        }),
];
