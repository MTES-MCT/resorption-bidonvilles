import { ParcelOwners } from '#root/types/resources/ParcelOwner.d';

export function serialized(override: Partial<ParcelOwners> = {}): ParcelOwners {
    const defaultObj: ParcelOwners = {
        parcelOwnerId: 1,
        shantytownId: 1,
        owners: [
            {
                ownerId: 1,
                name: 'Jean Bon',
                type: 2,
                createdAt: '2025-07-07 12:00:00.000000+00',
                createdBy: {
                    authorId: 2,
                    authorFirstName: 'Jean',
                    authorLastName: 'Dupont',
                    organizationName: 'Délégation Interministérielle à l\'Hébergement et à l\'Accès au Logement',
                    organizationId: 2,
                },
            },
            {
                ownerId: 2,
                name: 'Pierre Quiroul',
                type: 2,
                createdAt: '2025-07-07 12:10:00.000000+00',
                createdBy: {
                    authorId: 2,
                    authorFirstName: 'Jean',
                    authorLastName: 'Dupont',
                    organizationName: 'Délégation Interministérielle à l\'Hébergement et à l\'Accès au Logement',
                    organizationId: 2,
                },
            },
        ],
    };
    return { ...defaultObj, ...override };
}

export default serialized;
