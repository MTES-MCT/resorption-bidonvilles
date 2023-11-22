export type RolePermissionList = {
    [key: string]: {
        feature: string;
        entity: string;
        allowed: boolean;
        allow_all: boolean;
    }[]
};
