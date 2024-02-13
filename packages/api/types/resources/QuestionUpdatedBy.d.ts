type BaseQuestionUpdate = {
    id: number,
};

type FullQuestionUpdate = BaseQuestionUpdate & {
    first_name: string,
    last_name: string,
    role: string | null,
    position: string,
    organization: {
        id: number,
        name: string,
        abbreviation: string,
    }
};

export type QuestionUpdatedBy = BaseQuestionUpdate | FullQuestionUpdate;
