export default function (user) {
    return `${user.first_name} ${user.last_name.toUpperCase()} - ${
        user.organization.abbreviation || user.organization.name
    }`;
}
