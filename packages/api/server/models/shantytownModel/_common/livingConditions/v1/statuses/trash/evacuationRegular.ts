export default (town) => {
    if (town.trashEvacuationRegular === null) {
        return null;
    }

    return !!town.trashEvacuationRegular;
};
