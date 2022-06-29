import { getApi } from "#src/js/api";

/**
 * Lists all user activities
 *
 * @returns {Promise}
 */

export function listRegular(
    lastActivityDate,
    activityFilter,
    numberOfActivities,
    locationType,
    locationCode,
    maxActivityDate = null
) {
    const realActivityFilter =
        activityFilter.length === 0
            ? [
                  "shantytownCreation",
                  "shantytownClosing",
                  "shantytownUpdate",
                  "shantytownComment",
                  "highCovidComment",
                  "user"
              ]
            : activityFilter;

    const query = [
        { name: "lastActivityDate", value: lastActivityDate },
        { name: "numberOfActivities", value: numberOfActivities },
        { name: "filter", value: realActivityFilter.join(",") },
        { name: "locationType", value: locationType },
        { name: "locationCode", value: locationCode }
    ];

    if (maxActivityDate) {
        query.push({ name: "maxActivityDate", value: maxActivityDate });
    }

    const queryString = query
        .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
        .join("&");

    let url = `/activities?${queryString}`;
    return getApi(url);
}
