module.exports = (town) => {
    if (town.waterPotable === null) {
        return null;
    }

    return !!town.waterPotable;
};
