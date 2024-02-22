import { LocationType } from '#server/models/geoModel/LocationType.d';

export type InputInterventionArea = { type: LocationType, code: string | null };
