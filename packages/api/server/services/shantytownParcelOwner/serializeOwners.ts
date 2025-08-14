import userModel from '#server/models/userModel';
import findAll from '#server/models/ownerTypeModel/findAll';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { User } from '#root/types/resources/User.d';
import { SerializedOwner, RawParcelOwner, ParcelOwners } from '#root/types/resources/ParcelOwner.d';
import { OwnerType } from '#root/types/resources/OwnerType.d';

export default async (user: AuthUser, owners: RawParcelOwner[], withSerializedOwnerTypes: boolean = false): Promise<ParcelOwners> => {
    const serializedOwners: SerializedOwner[] = [];
    const ownerTypes: OwnerType[] = withSerializedOwnerTypes ? await findAll() : [];

    await Promise.all(
        owners.map(async (ownerDatas) => {
            const creatingUsers: User[] = await userModel.findByIds(user, ownerDatas.fk_user);
            const creatingUser: User | undefined = creatingUsers[0];

            serializedOwners.push(
                {
                    ownerId: ownerDatas.shantytown_parcel_owner_id,
                    name: ownerDatas.owner_name,
                    type: ownerDatas.fk_owner_type,
                    ...(withSerializedOwnerTypes && { typeDetails: ownerTypes.find(t => t.id === ownerDatas.fk_owner_type) }),
                    active: ownerDatas.active,
                    createdAt: ownerDatas.created_at,
                    createdBy: {
                        authorId: creatingUser?.id,
                        authorFirstName: creatingUser?.first_name,
                        authorLastName: creatingUser?.last_name,
                        organizationName: creatingUser?.organization?.name || '',
                        organizationId: creatingUser?.organization?.id || 0,
                    },
                },
            );
        }),
    );

    return {
        parcelOwnerId: owners[0].shantytown_parcel_owner_id,
        shantytownId: owners[0].fk_shantytown,
        owners: serializedOwners,
    };
};
