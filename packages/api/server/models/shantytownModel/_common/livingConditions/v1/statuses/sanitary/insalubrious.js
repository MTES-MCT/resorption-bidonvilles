module.exports = (town) => {
    if (town.sanitaryInsalubrious === null) {
        return null;
    }

    return !town.sanitaryInsalubrious;
};
