export type SerializedOwner = {
    ownerId?: number;
    name: string;
    type: number;
    createdAt: string;
    createdBy: {
        authorId: number;
        authorFirstName: string;
        authorLastName: string;
        organizationName: string;
        organizationId: number;
    };
};

export type ParcelOwnerInsert = {
    name: string;
    type: number;
};

export type RawParcelOwner = {
    shantytown_parcel_owner_id: number;
    fk_shantytown: number;
    fk_user: number;
    owner_name: string;
    fk_owner_type: number;
    active: boolean;
    created_at: string;
}[];

export type ParcelOwners = {
    parcelOwnerId: number;
    shantytownId: number;
    owners: SerializedOwner[];
};
