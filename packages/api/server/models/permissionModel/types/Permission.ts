import { permissionGeographicLevel } from './permissionGeographicLevel';

export interface Permission {
    allowed: true,
    geographic_level: permissionGeographicLevel,
}