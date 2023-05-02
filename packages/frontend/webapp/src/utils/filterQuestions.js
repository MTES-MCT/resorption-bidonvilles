export default function (questions, filters) {
    return questions.filter((question) => {
        if (
            filters.tags.length > 0 &&
            !question.tags.some(({ uid }) => filters.tags.includes(uid))
        ) {
            return false;
        }

        return true;
    });
}
