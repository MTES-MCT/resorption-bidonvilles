export default (town) => {
    if (town.waterPublicPoint === null) {
        return null;
    }

    return !town.waterPublicPoint;
};
