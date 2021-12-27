import { getApi } from "#helpers/api/main";

/**
 * Lists all user activities
 *
 * @returns {Promise}
 */

export function listRegular(
    lastActivityDate,
    activityFilter,
    numberActivities,
    locationType,
    locationCode
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
    return getApi(
        `/activities?lastActivityDate=${lastActivityDate}&numberActivities=${numberActivities}&filter=${realActivityFilter.join(
            ""
        )}&locationType=${locationType}&locationCode=${locationCode}`
    );
}
