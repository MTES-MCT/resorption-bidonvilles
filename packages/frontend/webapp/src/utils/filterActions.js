export default function (actions, filters) {
    return actions.filter((action) => {
        if (filters.location && !checkLocation(action, filters)) {
            return false;
        }

        if (filters.status && !checkStatus(action, filters.status)) {
            return false;
        }

        if (
            !filters.location &&
            filters.search &&
            !checkSearch(action, filters.search)
        ) {
            return false;
        }

        if (filters.topic.length > 0 && !checkTopic(action, filters.topic)) {
            return false;
        }

        if (
            filters.interventionLocation.length > 0 &&
            !checkInterventionLocation(action, filters.interventionLocation)
        ) {
            return false;
        }

        return true;
    });
}

function checkStatus(action, status) {
    if (status === "open") {
        return action.ended_at === null;
    }

    return action.ended_at !== null;
}

function checkSearch(action, search) {
    return !!action.name?.match(new RegExp(search, "ig"));
}

function checkLocation(action, filters) {
    if (!filters.location) {
        return true;
    }

    const l = action.location[filters.location.typeUid];

    if (!l) {
        return false;
    }

    if (l.code === `${filters.location.code}`) {
        return true;
    }

    return l.main === `${filters.location.code}`;
}

function checkTopic(action, filters) {
    return action.topics.some(({ uid }) => filters.includes(uid));
}

function checkInterventionLocation(action, filters) {
    return filters.includes(action.location_type);
}
