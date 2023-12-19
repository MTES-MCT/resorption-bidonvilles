export type RolePermissionList = {
    [key: string]: {
        feature: string;
        entity: string;
        allowed: boolean;
        allowed_on_national: boolean;
    }[]
};
