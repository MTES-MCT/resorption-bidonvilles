export default function (user) {
    let locationFilter = null;
    let searchFilter = "";
    if (!user?.intervention_areas.is_national) {
        const location = user.intervention_areas.areas.find(
            (area) => area.is_main_area === true
        );
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
