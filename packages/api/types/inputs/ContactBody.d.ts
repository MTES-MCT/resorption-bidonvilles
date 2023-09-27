import { SerializedOrganization } from '#server/models/userModel/getDirectory';
import { ContactRequestType } from '#root/types/resources/ContactRequestType.d';
import { ContactReferral } from '#root/types/resources/ContactReferral.d';
import { OrganizationCategory } from '#root/types/resources/OrganizationCategory.d';

type ContactBodyNewAssociation = {
    organization_full: null,
    organization_other: null,
    new_association: true,
    new_association_name: string,
    new_association_abbreviation: string,
    departement: string,
};

type ContactBodyExistingOrganization = {
    organization_full: SerializedOrganization,
    organization_other: null,
    new_association: false,
    new_association_name: null,
    new_association_abbreviation: null,
    departement: null,
};

type ContactBodyNewOrganization = {
    organization_full: null,
    organization_other: string,
    new_association: false,
    new_association_name: null,
    new_association_abbreviation: null,
    departement: null,
};
type ContactBodyOrganization = ContactBodyNewAssociation | ContactBodyNewOrganization | ContactBodyExistingOrganization;

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
} & ContactBodyOrganization;
