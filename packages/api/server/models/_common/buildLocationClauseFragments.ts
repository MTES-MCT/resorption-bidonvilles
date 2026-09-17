import geoUtils from '#server/utils/geo';
import outremer from '#server/utils/permission/outremer';
import { Location } from '#server/models/geoModel/Location.d';

const { fromGeoLevelToTableName } = geoUtils;
const RESTRICTED_LOCATION_TYPES = new Set(['metropole', 'outremer']);

export type LocationClauseFragments = { clauses: string[], replacements: Record<string, unknown> };

export default function buildLocationClauseFragments(locations: Location[], replacementPrefix: string): LocationClauseFragments {
    const replacements: Record<string, unknown> = {};

    const clauses = locations.flatMap((l, index) => {
        // On fait l'exclusion ou inclusion si c'est metropole ou outremer
        if (RESTRICTED_LOCATION_TYPES.has(l.type)) {
            replacements.outreMerDepts = outremer.departements;
            return l.type === 'metropole'
                ? 'departements.code NOT IN (:outreMerDepts)'
                : 'departements.code IN (:outreMerDepts)';
        }

        const key = `${replacementPrefix}${index}`;
        const arr = [`${fromGeoLevelToTableName(l.type)}.code = :${key}`];
        if (l.type === 'city') {
            arr.push(`${fromGeoLevelToTableName(l.type)}.fk_main = :${key}`);
        }
        replacements[key] = (l as any)[l.type].code;

        return arr;
    });

    return { clauses, replacements };
}
