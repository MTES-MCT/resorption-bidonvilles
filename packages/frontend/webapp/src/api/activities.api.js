import { axios } from "@/helpers/axios";

export function list(
    lastActivityDate,
    activityFilter,
    numberOfActivities,
    locationType,
    locationCode,
    maxActivityDate = null
) {
    const activityTypeFilter =
        activityFilter.activityType.length === 0
            ? [
                  "shantytownCreation",
                  "shantytownClosing",
                  "shantytownUpdate",
                  "shantytownComment",
                  "user",
                  "planComment",
              ]
            : activityFilter.activityType;
    const resorbedFilter =
        activityFilter.resorbed.length === 0
            ? ["yes", "no"]
            : activityFilter.resorbed;
    const myTownsFilter =
        activityFilter.myTowns.length === 0
            ? ["yes", "no"]
            : activityFilter.myTowns;

    const query = [
        { name: "lastActivityDate", value: lastActivityDate },
        { name: "numberOfActivities", value: numberOfActivities },
        { name: "activityTypeFilter", value: activityTypeFilter.join(",") },
        { name: "resorbedFilter", value: resorbedFilter.join(",") },
        { name: "myTownsFilter", value: myTownsFilter.join(",") },
        { name: "locationType", value: locationType },
        { name: "locationCode", value: locationCode },
    ];

    if (maxActivityDate) {
        query.push({ name: "maxActivityDate", value: maxActivityDate });
    }

    const queryString = query
        .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
        .join("&");

    return axios.get(`/activities?${queryString}`);
}