import ServiceError from '#server/errors/ServiceError';
import questionModel from '#server/models/questionModel';
import { AutocompleteResult } from '#root/types/resources/Autocomplete.d';


type QuestionAutocompleteResult = AutocompleteResult & {
    type: {
        id: 'question',
        label: 'Questions'
    }
};


type SearchQuestionItem = QuestionAutocompleteResult;

export default async (search: string): Promise<SearchQuestionItem[]> => {
    try {
        const questions = await questionModel.autocomplete(search);
        const serializedQuestions = questions.filter(question => question.similarity > 0.5).map((row): QuestionAutocompleteResult => ({
            id: row.id,
            label: `${row.question}`,
            type: {
                id: 'question',
                label: 'Questions',
            },
            similarity: row.similarity,
        }));
        return serializedQuestions;
    } catch (error) {
        throw new ServiceError('db_read_error', error);
    }
};
