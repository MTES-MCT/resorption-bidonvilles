export default [
    {
        value: "answer_date",
        label: "Date de dernière réponse",
        sortFn: (questions) => {
            // on part du principe que les réponses sont triées par ordre décroissant
            return questions.sort((a, b) => {
                if (a.answers.length === 0 && b.answers.length === 0) {
                    return a.createdAt < b.createdAt ? 1 : -1;
                } else if (a.answers.length === 0) {
                    return 1;
                } else if (b.answers.length === 0) {
                    return -1;
                }
                return a.answers[0].createdAt < b.answers[0].createdAt ? 1 : -1;
            });
        },
    },
    {
        value: "question_date",
        label: "Date de question",
        sortFn: (questions) => {
            return questions.sort((a, b) => {
                return a.createdAt < b.createdAt ? 1 : -1;
            });
        },
    },
];
