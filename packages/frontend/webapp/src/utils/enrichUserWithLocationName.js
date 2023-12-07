import computeOrganizationLocation from "./computeOrganizationLocation";

export default function (user) {
    let location;
    if (user.intervention_areas.is_national) {
        location = { type: "nation" };
    } else {
        location = user.intervention_areas.areas.find(
            (area) => area.is_main_area === true
        );
    }

    user.location_name = computeOrganizationLocation({
        location,
    }).name;
    return user;
}
