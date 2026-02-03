import { Organization } from '#root/types/resources/Organization.d';
import { ContactRequestType } from '#root/types/resources/ContactRequestType.d';
import { ContactReferral } from '#root/types/resources/ContactReferral.d';
import { OrganizationCategory } from '#root/types/resources/OrganizationCategory.d';

type ContactBodyExistingOrganization = {
    organization_full: Organization,
    organization_other: null,
};

type ContactBodyNewOrganization = {
    organization_full: null,
    organization_other: string,
};

type ContactBodyOrganization = ContactBodyNewOrganization | ContactBodyExistingOrganization;

export type ContactBody = {
    request_type: ContactRequestType,
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
