export default function (loadedPermissionsToAccessJustice) {
    return loadedPermissionsToAccessJustice.reduce((argAcc, org) => {
        const acc = { ...argAcc };
        if (!acc[org.id]) {
            let computedLocation = {};
            if (org.location_type === "nation") {
                computedLocation = {
                    label: "nation",
                    type: "",
                    name: "National",
                    code: null,
                };
            } else if (["region"].includes(org.location_type)) {
                computedLocation = {
                    label: "Région",
                    type: "region",
                    name: org.region_name,
                    code: org.region_code,
                };
            } else if (["departement"].includes(org.location_type)) {
                computedLocation = {
                    label: "Département",
                    type: "departement",
                    name: org.departement_name,
                    code: org.departement_code,
                };
            } else if (["epci"].includes(org.location_type)) {
                computedLocation = {
                    label: "Intercommunalité",
                    type: "epci",
                    name: org.epci_name,
                    code: org.epci_code,
                };
            } else if (["city"].includes(org.location_type)) {
                computedLocation = {
                    label: "Commune",
                    type: "city",
                    name: org.city_name,
                    code: org.city_code,
                };
            } else {
                computedLocation = {
                    name: location.name,
                    code: null,
                };
            }
            acc[org.id] = {
                id: org.id,
                name: org.name,
                abbreviation: org.abbreviation,
                type: {
                    category: org.type_category,
                    name: org.type_name,
                },
                location_name: computedLocation.name,
                location: computedLocation,
                users: [org],
            };
        } else {
            acc[org.id].users.push(org);
        }
        return acc;
    }, {});
}
