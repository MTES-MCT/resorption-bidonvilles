import QuestionInput from '#server/models/questionModel/QuestionInput.d';
import { EnrichedQuestion } from '#root/types/resources/QuestionEnriched.d';

export function serialized(override: Partial<EnrichedQuestion> = {}): EnrichedQuestion {
    const defaultObj:EnrichedQuestion = {
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
            organization: {
                id: 2,
                name: 'Délégation Interministérielle à l\'Hébergement et à l\'Accès au Logement',
                abbreviation: 'DIHAL',
            },
        },
        updatedBy: {
            id: 2,
            first_name: 'Jean',
            last_name: 'Dupont',
            role: 'Acteur national',
            position: 'Mock',
            organization: {
                id: 2,
                name: 'Délégation Interministérielle à l\'Hébergement et à l\'Accès au Logement',
                abbreviation: 'DIHAL',
            },
        },
        answers: [],
        attachments: [],
    };

    return Object.assign(defaultObj, override);
}

export function input(override: Partial<QuestionInput> = {}): QuestionInput {
    const questionUpdate:QuestionInput = {
        question_id: 1,
        question: 'Fake question',
        details: 'Fake Question details',
        people_affected: null,
        tags: ['housing'],
        other_tag: null,
        updated_by: 1,
    };
    return Object.assign(questionUpdate, override);
}

export default serialized;
