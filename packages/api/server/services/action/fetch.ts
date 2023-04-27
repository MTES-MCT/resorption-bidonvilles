import actionModel from '#server/models/actionModel/index';
import Action from '#server/models/actionModel/fetch/Action.d';
import { Permission } from '#server/models/permissionModel/types/Permission.d';

export default (permission: Permission, financePermission: Permission, actionIds: number[] = null): Promise<Action[]> => actionModel.fetch(actionIds, permission, financePermission);
