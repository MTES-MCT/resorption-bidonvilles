module.exports = (town) => {
    if (town.sanitaryOnSite === null) {
        return null;
    }

    return !!town.sanitaryOnSite;
};
