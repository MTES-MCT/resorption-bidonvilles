export default function (organization) {
    if (organization.location.type === "nation") {
        return {
            name: "National",
            code: null,
        };
    }

    const location = organization.location[organization.location.type];
    if (["city", "departement"].includes(organization.location.type)) {
        return {
            name: location.name,
            code: location.code,
        };
    }

    return {
        name: location.name,
        code: null,
    };
}
