import { serialized as fakeUser } from '#test/utils/userSimplified';
import { RawAnswer } from '#root/types/resources/AnswerRaw.d';


export function serialized(override: Partial<RawAnswer> = {}): RawAnswer {
    const defaultObj:RawAnswer = {
        id: 1,
        description: 'Une réponse',
        createdAt: null,
        createdBy: fakeUser(),
        question: 1,
        attachments: [],
    };
    return Object.assign(defaultObj, override);
};