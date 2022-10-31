export default (town) => {
    if (town.waterEveryoneHasAccess === null) {
        return null;
    }

    return !!town.waterEveryoneHasAccess;
};
