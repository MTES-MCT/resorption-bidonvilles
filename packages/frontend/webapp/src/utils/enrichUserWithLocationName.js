import computeOrganizationLocation from "./computeOrganizationLocation";

export default function (user) {
    user.location_name = computeOrganizationLocation(user).name;
    return user;
}
