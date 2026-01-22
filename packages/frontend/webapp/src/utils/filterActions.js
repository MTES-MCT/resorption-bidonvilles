export default function filterActions(actions, filters) {
    return actions.filter((action) => {
        if (
            filters.location?.type === "organization" &&
            !checkOrganization(action, filters.location.organizationId)
        ) {
            return false;
        }

        if (
            filters.location &&
            filters.location.type !== "organization" &&
            !checkLocation(action, filters)
        ) {
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
        return action.ended_at === null || new Date() < action.ended_at;
    }

    return action.ended_at !== null && new Date() > action.ended_at;
}

function checkSearch(action, search) {
    return (
        !!action.name?.match(new RegExp(search, "ig")) ||
        !!action.operators?.find(
            ({ name, abbreviation }) =>
                name.match(new RegExp(search, "ig")) ||
                (abbreviation && abbreviation.match(new RegExp(search, "ig")))
        ) ||
        !!action.managers?.find(
            ({ name, abbreviation }) =>
                name.match(new RegExp(search, "ig")) ||
                (abbreviation && abbreviation.match(new RegExp(search, "ig")))
        )
    );
}

function checkLocation(action, filters) {
    if (!filters.location) {
        return true;
    }

    const overseasRegions = new Set(["01", "02", "03", "04", "06"]);
    if (filters.location.typeUid === "metropole") {
        return !overseasRegions.has(action.location.region.code);
    }

    if (filters.location.typeUid === "outremer") {
        return overseasRegions.has(action.location.region.code);
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

function checkOrganization(action, organizationId) {
    return action.operators?.some((op) => op.id === organizationId);
}
