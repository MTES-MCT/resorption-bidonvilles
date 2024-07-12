import { RawAnswer } from '#root/types/resources/AnswerRaw.d';

export function serialized(override: Partial<RawAnswer> = {}): RawAnswer {
    const defaultObj:RawAnswer = {
        id: 1,
        description: 'Il faut un travail commun entre tous les acteurs locaux et les habitants',
        createdAt: (new Date(2023, 0, 2, 1, 0, 0)).getTime() / 1000,
        createdBy: {
            id: 2,
            email: 'jean.dupont@dihal.gouv.fr',
            first_name: 'Jean',
            last_name: 'Dupont',
            role: 'Acteur national',
            position: 'Mock',
            organization: 'DIHAL',
            organization_id: 2,
        },
        question: 2,
        attachments: [],
    };

    return Object.assign(defaultObj, override);
}

export default serialized;
