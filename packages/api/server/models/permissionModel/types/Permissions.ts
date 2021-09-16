import { Permission } from './Permission';

export interface Permissions {
    [entity: string]: {
        [feature: string]: Permission
    }
}