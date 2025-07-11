import { AuthUser } from '#server/middlewares/authMiddleware';
import { SerializedOwner, RawParcelOwner, ParcelOwners } from '#root/types/resources/ParcelOwner.d';

export default async (user: AuthUser, owners: RawParcelOwner): Promise<ParcelOwners> => {
    const serializedOwners: SerializedOwner[] = [];

    owners.forEach((ownerDatas) => {
        serializedOwners.push(
            {
                ownerId: ownerDatas.fk_user,
                name: ownerDatas.owner_name,
                type: ownerDatas.fk_owner_type,
                createdAt: ownerDatas.created_at,
                createdBy: {
                    authorId: user.id,
                    authorFirstName: user.first_name,
                    authorLastName: user.last_name,
                    organizationName: user.organization?.name || '',
                    organizationId: user.organization?.id || 0,
                },
            },
        );
    });

    return {
        parcelOwnerId: owners[0].shantytown_parcel_owner_id,
        shantytownId: owners[0].fk_shantytown,
        owners: serializedOwners,
    };
};
