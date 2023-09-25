import { SerializedOrganization } from '#server/models/userModel/getDirectory';
import { ContactRequestType } from '#root/types/resources/ContactRequestType.d';
import { ContactReferral } from '#root/types/resources/ContactReferral.d';
import { OrganizationCategory } from '#root/types/resources/OrganizationCategory.d';

export type ContactBody = {
    request_type: ContactRequestType[],
    is_actor: boolean,
    referral: ContactReferral,
    referral_other: string,
    referral_word_of_mouth?: string,
    last_name: string,
    first_name: string,
    email: string,
    phone: string,
    position: string,
    access_request_message: string,
    organization_category: OrganizationCategory,
    organization_full: SerializedOrganization,
    new_association: boolean,
    new_association_name: string,
    new_association_abbreviation: string,
    departement: string,
    organization_other: string,
};
