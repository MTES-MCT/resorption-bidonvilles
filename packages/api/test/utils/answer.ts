import Answer from '#server/models/answerModel/Answer.d';

export function serialized(override: Partial<Answer> = {}): Answer {
    const defaultObj:Answer = {
        id: 1,
        description: 'Il faut un travail commun entre tous les acteurs locaux et les habitants',
        createdAt: (new Date(2023, 0, 2, 1, 0, 0)).getTime() / 1000,
        createdBy: {
            id: 2,
            first_name: 'Jean',
            last_name: 'Dupont',
            position: 'Mock',
            organization: 'DIHAL',
            organization_id: 2,
            role: 'Acteur national',
        },
        question: 2,
    };

    return Object.assign(defaultObj, override);
}

export default serialized;