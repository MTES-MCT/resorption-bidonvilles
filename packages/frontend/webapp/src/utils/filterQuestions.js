export default function (questions, filters) {
    const trimmedSearch = (filters.search || "")
        .toLowerCase()
        .replace(/^\s*|\s*$/g, "")
        .replace(/\s+/g, " ");
    const searchKeywords = trimmedSearch !== "" ? trimmedSearch.split(" ") : [];
    console.log(filters.tags);
    return questions.filter((question) => {
        const tags = Object.keys(filters.tags).filter(
            (key) => filters.tags[key] === true
        );

        if (
            tags.length > 0 &&
            tags.every((key) => {
                return !question.tags.map(({ uid }) => uid).includes(key);
            })
        ) {
            return false;
        }

        if (
            searchKeywords.length > 0 &&
            !searchKeywords.every(
                (keyword) =>
                    question.question.toLowerCase().includes(keyword) ||
                    question.details.toLowerCase().includes(keyword)
            )
        ) {
            return false;
        }

        return true;
    });
}
