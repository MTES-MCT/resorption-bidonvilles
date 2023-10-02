import permissionModel from '#server/models/permissionModel/index';
import { Permissions } from '#server/models/permissionModel/types/Permissions.d';

export default async (userId: number): Promise<Permissions> => {
    const hash = await permissionModel.find([userId]);
    return hash[userId] || {};
};
