export default function (shantytown, location) {
    if (!location?.typeUid || location.typeUid === "nation") {
        return true;
    }

    return (
        shantytown[location.typeUid].code === location.code ||
        shantytown[location.typeUid].main === location.code
    );
}
