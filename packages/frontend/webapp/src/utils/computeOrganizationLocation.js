export default function (organization) {
    if (organization.intervention_areas.is_national) {
        return {
            name: "National",
            code: null,
        };
    }

    const area = organization.intervention_areas.areas.find(
        (area) => area.is_main_area === true
    );
    return {
        name: area[area.type].name,
        code: area[area.type].code,
    };
}
