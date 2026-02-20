import { Organization } from '#root/types/resources/Organization.d';
import { ContactRequestType } from '#root/types/resources/ContactRequestType.d';
import { ContactReferral } from '#root/types/resources/ContactReferral.d';
import { OrganizationCategory } from '#root/types/resources/OrganizationCategory.d';
import { PublicEstablishment } from '#root/types/resources/PublicEstablishment.d';
import { OrganizationTypeFull } from '#root/types/resources/OrganizationTypeFull.d';

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
    organization_full?: Organization | null,
    organization_type_full?: OrganizationTypeFull,
    organization_other: string | null,
    organization_other_acronyme?: string,
    organization_other_territory_type?: string,
    organization_other_territory?: string,
    territorial_collectivity: string | null,
    association: number | null,
    private_organization: string | null,
    public_establishment: PublicEstablishment | null,
};
