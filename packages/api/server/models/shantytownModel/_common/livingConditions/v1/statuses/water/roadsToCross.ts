export default (town) => {
    if (town.waterRoadsToCross === null) {
        return null;
    }

    return !town.waterRoadsToCross;
};
