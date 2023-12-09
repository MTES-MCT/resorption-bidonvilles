export default function (organization) {
    if (organization.intervention_areas.is_national) {
        return {
            name: "National",
            code: null,
        };
    }

    const area = organization.intervention_areas.areas[0];
    return {
        name: area[area.type].name,
        code: area[area.type].code,
    };
}
