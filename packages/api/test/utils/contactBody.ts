import { serialized as fakeOrganization } from '#test/utils/organization';
import { ContactBody } from '#root/types/inputs/ContactBody.d';

export function existingOrganization(override: Partial<ContactBody> = {}): ContactBody {
    const defaultObj: ContactBody = {
        request_type: 'access-request',
        is_actor: true,
        referral: 'dihal_event',
        referral_other: '',
        last_name: 'Dupont',
        first_name: 'Jean',
        email: 'jean.dupont@beta.gouv.fr',
        phone: '0102030405',
        position: 'Développeur',
        access_request_message: 'Je suis une demande d\'accès',
        organization_category: 'public_establishment',
        organization_full: fakeOrganization(),
        organization_other: null,
        territorial_collectivity: null,
        association: null,
        private_organization: null,
        public_establishment: null,
    };

    return Object.assign(defaultObj, override);
}

export default existingOrganization;
