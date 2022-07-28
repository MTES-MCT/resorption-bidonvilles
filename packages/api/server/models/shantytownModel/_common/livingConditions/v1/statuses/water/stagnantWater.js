module.exports = (town) => {
    if (town.waterStagnantWater === null) {
        return null;
    }

    return !town.waterStagnantWater;
};
