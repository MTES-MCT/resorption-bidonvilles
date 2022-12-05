export default function (user) {
    let locationFilter = null;
    let searchFilter = "";
    if (user?.organization.location.type !== "nation") {
        const { location } = user.organization;
        const { code, name } = location[location.type];
        locationFilter = {
            code,
            departement: location.departement?.code,
            typeUid: location.type,
            typeName: "-",
        };
        searchFilter = name;
    }

    return {
        search: searchFilter,
        data: locationFilter,
    };
}
