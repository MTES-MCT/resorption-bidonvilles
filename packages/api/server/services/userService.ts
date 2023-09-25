import ServiceError from '#server/errors/ServiceError';
import permissionModel from '#server/models/permissionModel';
import { Permissions } from '#server/models/permissionModel/types/Permissions.d';
import { SerializedUser } from '#server/models/userModel/_common/types/SerializedUser.d';
import accessRequestService from '#server/services/accessRequest/accessRequestService';
import { ContactBody } from '#root/types/inputs/ContactBody.d';
import createUser from './createUser';

const userService = {
    async create(data, createdBy = null): Promise<SerializedUser> {
        // insert user into database
        try {
            return await createUser(Object.assign({}, data, {
                created_by: createdBy,
            }));
        } catch (error) {
            throw new ServiceError('db_write', error);
        }
    },

    async register(data: ContactBody): Promise<SerializedUser> {
        let user;
        try {
            user = await userService.create({
                last_name: data.last_name,
                first_name: data.first_name,
                email: data.email,
                phone: data.phone,
                organization: data.organization_full?.id || null,
                new_association: data.new_association,
                new_association_name: data.new_association_name || null,
                new_association_abbreviation: data.new_association_abbreviation || null,
                departement: data.departement || null,
                position: data.position,
                access_request_message: data.access_request_message,
            });
        } catch (error) {
            throw new ServiceError('insert_failed', error);
        }

        try {
            await accessRequestService.handleNewAccessRequest(user);
        } catch (error) {
            // @todo register this error to Sentry
        }

        return user;
    },

    async getPermissions(userId: number): Promise<Permissions> {
        const hash = await permissionModel.find([userId]);
        return hash[userId] || {};
    },
};

export default userService;
