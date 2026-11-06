import userModel from '#server/models/userModel';
import ServiceError from '#server/errors/ServiceError';
import setPassword from './setPassword';
import type { UserUpdateInput } from '#root/types/resources/User.d';

/**
 * Met à jour un utilisateur
 * @param userId    - ID utilisateur en base
 * @param userDatas - Data de l'utilisateur à modifier
 * @returns Data modifiée
 */
const update = async (userId: number, userDatas: UserUpdateInput): Promise<UserUpdateInput> => {
    const user = await userModel.findOne(userId, { auth: true });

    if (user === null) {
        throw new ServiceError('unknown_user', new Error(`User #${userId} does not exist`));
    }

    const filteredData: UserUpdateInput = Object.keys(userDatas).reduce((acc, key) => {
        if (userDatas[key] === undefined) {
            return acc;
        }

        acc[key] = userDatas[key];
        return acc;
    }, {});

    // Si le password est changé, on update côté Keycloak
    try {
        if (filteredData.password) {
            await setPassword(filteredData.password, userId, user);
            delete filteredData.password;
        }
    } catch (error) {
        throw new ServiceError('update_failed', new Error('Une erreur est survenue dans la mise à jour de votre mot de passe'));
    }

    // On update en base de donnée
    try {
        await userModel.update(userId, filteredData);
        if (filteredData.email_unsubscriptions) {
            delete filteredData.email_unsubscriptions;
        }
        return filteredData;
    } catch (error) {
        throw new ServiceError('update_failed', new Error('Une erreur est survenue dans l\'écriture de vos informations en base de données.'));
    }
};

export default update;
