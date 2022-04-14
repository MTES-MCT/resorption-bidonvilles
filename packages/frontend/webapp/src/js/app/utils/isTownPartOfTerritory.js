export default function isTownPartOfTerritory(shantytown, location) {
    if (location.locationType === "nation") {
        return true;
    } else if (
        shantytown[location.locationType].code === location.locationCode
    ) {
        return true;
    }
    return false;
}
