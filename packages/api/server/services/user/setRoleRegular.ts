import userModelUpdate from '#server/models/userModel/update';
import findOneUser from '#server/models/userModel/findOne';
import ServiceError from '#server/errors/ServiceError';
import { User } from '#root/types/resources/User.d';

function canUpdateRole(user: User, roleId: string): void {
    if (roleId && roleId === 'intervener')
    {
        if (user.is_admin !== true) {
            throw new ServiceError('permission_denied', new Error('Vous devez être Administrateur Local pour pouvoir accorder ce rôle'));
        }
    } else {
        if (user.is_superuser !== true) {
            throw new ServiceError('permission_denied', new Error('Vous devez être Administrateur National pour pouvoir accorder ce rôle'));
        }
    }
}

export default async (currentUser: User, userToUpdateId: number, roleId: string): Promise<User> => {

    canUpdateRole(currentUser, roleId);

    let updatedUser: User;
    try {
        await userModelUpdate(userToUpdateId, {
            fk_role_regular: roleId,
        });
        updatedUser = await findOneUser(userToUpdateId, { extended: true }, null, 'read');
    } catch (error) {
        throw new ServiceError('update_role_regular_failure', error);
    }
    return updatedUser;
};
