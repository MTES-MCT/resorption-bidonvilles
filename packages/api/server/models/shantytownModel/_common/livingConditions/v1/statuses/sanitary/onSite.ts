export default (town) => {
    if (town.sanitaryOnSite === null) {
        return null;
    }

    return !!town.sanitaryOnSite;
};
