export default (town) => {
    if (town.trashAccumulation === null) {
        return null;
    }

    return !town.trashAccumulation;
};
