/* eslint-disable newline-per-chained-call */
import { body, param } from 'express-validator';
import getLocation from '#server/models/geoModel/getLocation';
import findOneUser from '#server/models/userModel/findOne';
import { Location } from '#server/models/geoModel/Location.d';
import { User } from '#root/types/resources/User.d';

export default [
    param('id')
        .toInt()
        .isInt().bail().withMessage('L\'identifiant de l\'utilisateur à modifier est invalide')
        .custom(async (value, { req }) => {
            if (req.user.id === value) {
                throw new Error('Vous ne pouvez pas modifier vos propres territoires d\'intervention');
            }

            let user: User;
            try {
                user = await findOneUser(value, undefined, req.user, 'activate');
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la recherche de l\'utilisateur en base de données');
            }

            if (user === null) {
                throw new Error('L\'utilisateur à mettre à jour est introuvable en base de données');
            }

            req.userToUpdate = user;
            return true;
        }),

    body('organization_areas')
        .isArray({ min: 1 }).withMessage('Vous devez préciser un ou plusieurs territoires d\'intervention pour la structure')
        .custom(async (value, { req }) => {
            let locations: Location[];
            try {
                locations = await Promise.all(
                    value.map(({ code, type }) => getLocation(type, code)),
                );
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la vérification des territoires d\'intervention de la structure');
            }

            const errors = locations.reduce((acc, v, index) => {
                if (v !== null) {
                    return acc;
                }

                acc.push(v[index]?.name || 'nom inconnu');
                return acc;
            }, []);
            if (errors.length > 0) {
                throw new Error(`Les territoires d'intervention suivants n'ont pas été retrouvés en base de données : ${errors.join(', ')}`);
            }

            req.organizationAreas = locations;
            return true;
        }),

    body('user_areas')
        .optional({ nullable: true })
        .isArray().withMessage('La liste des territoires d\'intervention de l\'utilisateur doit être un tableau')
        .custom(async (value, { req }) => {
            let locations: Location[];
            try {
                locations = await Promise.all(
                    value.map(({ code, type }) => getLocation(type, code)),
                );
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la vérification des territoires d\'intervention de la structure');
            }

            const errors = locations.reduce((acc, v, index) => {
                if (v !== null) {
                    return acc;
                }

                acc.push(v[index]?.name || 'nom inconnu');
                return acc;
            }, []);
            if (errors.length > 0) {
                throw new Error(`Les territoires d'intervention suivants n'ont pas été retrouvés en base de données : ${errors.join(', ')}`);
            }

            req.userAreas = locations;
            return true;
        }),
    body('user_areas')
        .customSanitizer(value => value || []),
];
