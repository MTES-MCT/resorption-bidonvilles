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
                    id: 2,
                    name: 'Délégation Interministérielle à l\'Hébergement et à l\'Accès au Logement',
                },
            },
            created_at: (new Date(2020, 0, 1, 1, 0, 0)).getTime() / 1000,
            expires_at: (new Date(2020, 0, 8, 1, 0, 0)).getTime() / 1000,
            used_at: (new Date(2020, 0, 1, 2, 0, 0)).getTime() / 1000,
            refused_at: null,
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
        password: '456c4ee17e82f23b301bf91610526117d0ad5c5bd81d889e522072c7f554258aa2f59503a859ad9a18badb12b275c216340f1fd56bc3327c7bbcb0090ef82eebe4218d67c3e150e92642fd8dec026e1df181841366df788c6c050de04354b479ff24f5c259982b412ab155c4a9cd7d63c8419f4afb33a7b575e4372b3610a60af2aefcfdd9f2d5e12de8f50d9c895a185d8c6e85494816ba54788ccfb5e905967090fad19effbd3ec3f7b76316377e2d9cf3ac11c9a3850c79581ed50a63324602d66853d90b96a68454d67492580bc6a275fb1d5bd367c585c29f9bb68a77689e1e1c1d8f865ba8da6f6dffe8afd12c6c543fc0429e4fa772606050c373aeeebd171658033d1f28f575d4919051d00a3f149c5a85d06a641359ca722bd59a9c92981cc74c80e6d6225ab109da7630cdba3520fe993d5ea52330c19521e972f0d0f7ded09ef8f8fb42636e28acc4dcb0d793b9db4c658301105dab21348cfe3dc245562135412a4fffceeb635c740a52de95cfd13d95e895f5ceaeaba5582edf8404caf6a4bf8d5caf4fb9f5d569e379937eea8776456d4533499737648005ddb42e64c28c9fb46483581348c18bf62b35828d75aa352810f7c7e9b164791c8b3797c37163aeee49b88849f7f411107153b922587b5d8831775f98c0f61db8665ca14db5c98cd4029b48ca8518cb8d18d8c3182ec5ade18df964d41e890522ca',
        salt: '8201653e7391e7a80f749e6b2609956a',
    };

    return Object.assign(defaultUser, override);
}

export default serialized;
