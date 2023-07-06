export default function (questions, filters) {
    const trimmedSearch = (filters.search || "")
        .toLowerCase()
        .replace(/^\s*|\s*$/g, "")
        .replace(/\s+/g, " ");
    const searchKeywords = trimmedSearch !== "" ? trimmedSearch.split(" ") : [];

    return questions.filter((question) => {
        if (
            Object.keys(filters).some((key) => {
                if (
                    filters[key].length === 1 &&
                    filters[key][0] === "yes" &&
                    !question.tags.map(({ uid }) => uid).includes(key)
                ) {
                    return true;
                }
                if (
                    filters[key].length === 1 &&
                    filters[key][0] === "no" &&
                    question.tags.map(({ uid }) => uid).includes(key)
                ) {
                    return true;
                }
                return false;
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
