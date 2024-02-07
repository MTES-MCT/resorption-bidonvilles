export default function (user, includeOrganization = true) {
    const name = `${user.first_name} ${user.last_name.toUpperCase()}`;
    if (user.organization && includeOrganization === true) {
        return `${name} - ${
            user.organization.abbreviation || user.organization.name
        }`;
    }

    return name;
}
