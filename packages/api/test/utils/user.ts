import { AuthUser } from '#server/middlewares/authMiddleware';
import { User } from '#root/types/resources/User.d';

export function serialized(override: Partial<User> = {}): AuthUser {
    const defaultUser: AuthUser = {
        id: 2,
        first_name: 'Jean',
        last_name: 'Dupont',
        email: 'jean.dupont@gouv.fr',
        phone: '0611223344',
        position: 'Mock',
        status: 'active',
        created_at: (new Date(2020, 0, 1, 0, 0, 0)).getTime() / 1000,
        user_accesses: [{
            id: 2,
            sent_by: {
                id: 1,
                email: 'pierre@untel.fr',
                first_name: 'Pierre',
                last_name: 'Untel',
                position: 'Mock',
                organization: {
                    id: 1,
                    name: 'Délégation Interministérielle à l\'Hébergement et à l\'Accès au Logement',
                },
            },
            created_at: (new Date(2020, 0, 1, 1, 0, 0)).getTime() / 1000,
            expires_at: (new Date(2020, 0, 8, 1, 0, 0)).getTime() / 1000,
            used_at: (new Date(2020, 0, 1, 2, 0, 0)).getTime() / 1000,
        }],
        organization: {
            id: 2,
            name: 'Délégation Interministérielle à l\'Hébergement et à l\'Accès au Logement',
            abbreviation: 'DIHAL',
            active: true,
            type: {
                id: 10,
                uid: 'delegation_interministerielle',
                name_singular: 'Délégation interministérielle',
                name_plural: 'Délégations interministérielles',
                abbreviation: null,
            },
            category: {
                uid: 'administration',
                name_singular: 'Administration centrale',
                name_plural: 'Administrations centrales',
            },
        },
        intervention_areas: {
            is_national: false,
            areas: [{
                type: 'nation',
                area_of: 'organization',
                is_main_area: true,
                latitude: 46.7755829,
                longitude: 2.0497727,
                region: null,
                departement: null,
                epci: null,
                city: null,
            }],
        },
        charte_engagement_a_jour: true,
        is_admin: false,
        role: 'Acteur national',
        role_id: 'national_establisment',
        is_superuser: false,
        expertise_topics_chosen: true,
        expertise_comment: null,
        expertise_topics: [
            { uid: 'sante', label: 'Santé', type: 'expertise' },
            { uid: 'logement', label: 'Logement', type: 'interest' },
        ],
        access_request_message: 'Demande d\'accès pour tests automatisés',
        permissions: {
            shantytown: {
                create: {
                    allowed: true,
                    allowed_on_national: true,
                    allowed_on: null,
                },
                list: {
                    allowed: true,
                    allowed_on_national: true,
                    allowed_on: null,
                },
                read: {
                    allowed: true,
                    allowed_on_national: true,
                    allowed_on: null,
                },
                update: {
                    allowed: true,
                    allowed_on_national: true,
                    allowed_on: null,
                },
                close: {
                    allowed: true,
                    allowed_on_national: true,
                    allowed_on: null,
                },
                export: {
                    allowed: true,
                    allowed_on_national: true,
                    allowed_on: null,
                },
            },
            shantytown_justice: {
                access: {
                    allowed: true, allowed_on_national: true, allowed_on: null,
                },
            },
            shantytown_comment: {
                create: {
                    allowed: true, allowed_on_national: true, allowed_on: null,
                },
                list: {
                    allowed: true, allowed_on_national: true, allowed_on: null,
                },
                listPrivate: {
                    allowed: true, allowed_on_national: true, allowed_on: null,
                },
            },
            user: {},
            stats: {},
        },
        admin_comments: null,
        email_subscriptions: [],
        question_subscriptions: {},
        permission_options: [],
        last_access: Date.now() / 1000,
        last_version: '0.0.0',
        last_changelog: '0.0.0',
        isAllowedTo(feature, entity) {
            return defaultUser.permissions && defaultUser.permissions[entity] && defaultUser.permissions[entity][feature] && defaultUser.permissions[entity][feature].allowed === true;
        },
    };

    return Object.assign(defaultUser, override);
}

export default serialized;
