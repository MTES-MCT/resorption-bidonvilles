export default (organization) => {
    let { name } = organization;

    if (organization.type_abbreviation !== null) {
        name = organization.type_abbreviation;
    } else if (organization.abbreviation !== null) {
        name = organization.abbreviation;
    }

    switch (organization.location_type) {
        case 'city':
            name += ` - ${organization.city_code}`;
            break;
        case 'epci':
            if (name.indexOf(organization.epci_name) === -1) {
                name += ` - ${organization.epci_name}`;
            }
            break;
        case 'departement':
            name += ` - ${organization.departement_code}`;
            break;
        case 'region':
            if (name.indexOf(organization.region_name) === -1) {
                name += ` - ${organization.region_name}`;
            }
            break;
        default:
    }

    return name;
};
