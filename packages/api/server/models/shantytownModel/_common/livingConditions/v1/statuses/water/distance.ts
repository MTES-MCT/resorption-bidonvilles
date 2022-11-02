export default (town) => {
    if (town.waterDistance === null) {
        return null;
    }

    return town.waterDistance === '0-20';
};
