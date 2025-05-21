import getSince from "./getSince";

function getMostRecentComment(comments) {
    return comments.reduce((newest, current) => {
        return current.createdAt > newest.createdAt ? current : newest;
    }, comments[0]);
}

function getMostRecentUpdateOnTown(mostRecentComment, townUpdatedAt) {
    const { months } = getSince(townUpdatedAt);

    if (months >= 6) {
        return townUpdatedAt;
    }

    return mostRecentComment.createdAt > townUpdatedAt
        ? mostRecentComment.createdAt
        : townUpdatedAt;
}

function getTownLastUpdatedAt(town) {
    if (!town.comments || town.comments.length === 0) {
        return town.updatedAt;
    }
    const mostRecentComment = getMostRecentComment(town.comments);
    return getMostRecentUpdateOnTown(mostRecentComment, town.updatedAt);
}

export { getMostRecentComment, getTownLastUpdatedAt };
