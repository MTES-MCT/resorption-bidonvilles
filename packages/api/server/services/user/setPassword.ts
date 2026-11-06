import userModel from '#server/models/userModel';
import authUtils from '#server/utils/auth';
import checkPassword from '#server/utils/checkPassword';
import ServiceError from '#server/errors/ServiceError';
import activate from './activate';
import { User } from '#root/types/resources/User.d';

const { hashPassword } = authUtils;

/**
 * Met à jour le mot de passe d'un utilisateur
 * @param {string} password - Mot de passe
 * @param {number} userId   - Identifiant de l'utilisateur
 * @param {User} user       - Objet User
 */
const setPassword = async (password: string, userId: number, user: User) => {
    if (user === null) {
        throw new ServiceError('setPassword', new Error('L\'utilisateur n\'existe pas'));
    }

    if (user.id !== userId && !user.is_admin) {
        throw new ServiceError('setPassword', new Error('Vous n\'avez pas les droits pour effectuer cette opération'));
    }

    const errors = checkPassword(password, user.is_admin);

    if (errors.length > 0) {
        throw new ServiceError('setPassword', new Error(`Le mot de passe est invalide: ${errors.join(', ')}`));
    }

    // On MAJ le mot de passe dans Keycloak
    try {
        await activate(user.keycloak_id, user.email, password);
    } catch (error) {
        throw new ServiceError('setPassword', new Error('Une erreur est survenue lors de la mise à jour du mot de passe'));
    }

    // On MAJ la DB métier
    try {
        await userModel.update(user.id, {
            password: hashPassword(password, user.salt),
            password_conformity: (!!user.is_admin),
        });
    } catch (error) {
        throw new ServiceError('setPassword', new Error('Une erreur est survenue lors de l\'écriture en base de données'));
    }
};

export default setPassword;
