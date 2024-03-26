import { sequelize } from '#db/sequelize';
import userModelUpdate from '#server/models/userModel/update';
import findOneUser from '#server/models/userModel/findOne';
import findOneRole from '#server/models/roleModel/findOne';
import ServiceError from '#server/errors/ServiceError';
import { User } from '#root/types/resources/User.d';
import can from '#server/utils/permission/can';

type RoleRaw = {
    id: string,
    name: string,
};

function canUpdateRole(user: User, role: RoleRaw): void {
    if (role && role.name !== 'intervener')
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

    let role: RoleRaw = undefined;
    try {
        role = await findOneRole(roleId, 'regular');
    } catch {
        throw new ServiceError('role_not_found', new Error('Le role n\'existe pas'));
    }

    canUpdateRole(currentUser, role);

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
