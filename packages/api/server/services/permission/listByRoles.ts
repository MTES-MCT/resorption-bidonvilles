import permissionModel from '#server/models/permissionModel/index';
import { RolePermissionList } from '#root/types/resources/Permission.d';

export default (): Promise<RolePermissionList> => permissionModel.listByRoles();
