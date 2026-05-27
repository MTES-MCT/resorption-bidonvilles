import { ShantytownUpdateData } from '../types/ShantytownUpdateData';

const EXCLUDED_KEYS = new Set([
    'social_origins',
    'closing_solutions',
    'sanitary_toilet_types',
    'electricity_access_types',
    'reinstallation_incoming_towns',
    'preparatory_phases',
]);

const ACCESS_KEYS = new Set(['owner']);

const JUSTICE_KEYS = new Set([
    'owner_complaint',
    'justice_procedure',
    'justice_rendered',
    'justice_rendered_at',
    'justice_rendered_by',
    'justice_challenged',
    'police_status',
    'police_requested_at',
    'police_granted_at',
    'bailiff',
    'existing_litigation',
    'evacuation_under_time_limit',
    'administrative_order_decision_at',
    'administrative_order_decision_rendered_by',
    'administrative_order_evacuation_at',
    'insalubrity_order',
    'insalubrity_order_displayed',
    'insalubrity_order_type',
    'insalubrity_order_by',
    'insalubrity_order_at',
    'insalubrity_parcels',
    'attachments',
]);

interface PartitionedData {
    commonData: Record<string, any>;
    justiceData: Record<string, any>;
    ownerData: Record<string, any>;
}

/**
 * Répartit les données du shantytown en 3 catégories : communes, justice, propriétaire
 */
export default function partitionShantytownData(data: ShantytownUpdateData): PartitionedData {
    if (!data) {
        return {
            commonData: {},
            justiceData: {},
            ownerData: {},
        };
    }

    return Object.keys(data).reduce(
        (acc, key) => {
            if (EXCLUDED_KEYS.has(key)) {
                return acc;
            }

            if (JUSTICE_KEYS.has(key)) {
                return {
                    ...acc,
                    justiceData: {
                        ...acc.justiceData,
                        ...(data[key] === undefined ? {} : { [key]: data[key] }),
                    },
                };
            }

            if (ACCESS_KEYS.has(key)) {
                return {
                    ...acc,
                    ownerData: {
                        ...acc.ownerData,
                        [key]: data[key],
                    },
                };
            }

            return {
                ...acc,
                commonData: {
                    ...acc.commonData,
                    ...(data[key] === undefined ? {} : { [key]: data[key] }),
                },
            };
        },
        { commonData: {}, justiceData: {}, ownerData: {} },
    );
}
