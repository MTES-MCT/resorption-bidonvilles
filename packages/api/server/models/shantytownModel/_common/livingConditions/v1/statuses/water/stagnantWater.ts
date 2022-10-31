export default (town) => {
    if (town.waterStagnantWater === null) {
        return null;
    }

    return !town.waterStagnantWater;
};
