import { Permission } from './Permission.d';

export interface Permissions {
    [entity: string]: {
        [feature: string]: Permission
    }
}
