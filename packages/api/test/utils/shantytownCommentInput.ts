import fakeFile from './file';

// eslint-disable-next-line import/prefer-default-export
export function serialized(override = {}) {
    const defaultObj = {
        id: 1,
        description: 'Un commentaire',
        createdAt: (new Date(2020, 0, 1, 0, 0, 0)).getTime() / 1000,
        organization_target_name: [],
        user_target_name: [],
        createdBy: {
            id: 2,
            first_name: 'Jean',
            last_name: 'Dupont',
            position: 'Mock',
            organization: 'Délégation Interministérielle à l\'Hébergement et à l\'Accès au Logement',
            organization_id: 2,
        },
        shantytown: 1,
        tags: [
            { uid: 'conditions_de_vie', tag: 'Conditions de vie', type: 'ordinaire' },
            { uid: 'passage_sur_site', tag: 'Passage sur site', type: 'ordinaire' },
        ],
        files: [fakeFile()],
        targets: {
            users: [{ id: 1 }],
            organizations: [],
        },
    };

    return Object.assign(defaultObj, override);
}
