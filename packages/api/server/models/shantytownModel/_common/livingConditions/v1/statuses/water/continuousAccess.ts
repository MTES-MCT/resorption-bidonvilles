export default (town) => {
    if (town.waterContinuousAccess === null) {
        return null;
    }

    return !!town.waterContinuousAccess;
};
