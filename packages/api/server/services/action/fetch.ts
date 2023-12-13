import actionModel from '#server/models/actionModel/index';
import { Permission } from '#server/models/permissionModel/types/Permission.d';
import Action from '#root/types/resources/Action.d';

export default (permission: Permission, financePermission: Permission, actionIds: number[] = null): Promise<Action[]> => actionModel.fetch(actionIds, permission, financePermission);
