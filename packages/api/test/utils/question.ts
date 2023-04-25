import Question from '#server/models/questionModel/Question.d';

export function serialized(override: Partial<Question> = {}): Question {
    const defaultObj:Question = {
        id: 1,
        question: 'Comment résorber les bidonvilles ?',
        details: 'J\'aimerais savoir comment accompagner les habitants vers un logement',
        peopleAffected: 5000,
        tags: [
            { uid: 'housing', name: 'Logement' },
        ],
        createdAt: (new Date(2023, 0, 1, 1, 0, 0)).getTime() / 1000,
        updatedAt: null,
        solvedAt: null,
        createdBy: {
            id: 2,
            first_name: 'Jean',
            last_name: 'Dupont',
            role: 'Acteur national',
            position: 'Mock',
            organization: 'Délégation Interministérielle à l\'Hébergement et à l\'Accès au Logement',
            organization_id: 2,
        },
        answers: [],
    };

    return Object.assign(defaultObj, override);
}

export default serialized;
