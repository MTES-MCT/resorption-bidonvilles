export default function (plans, filters) {
    return plans.filter((plan) => {
        if (filters.location && !checkLocation(plan, filters)) {
            return false;
        }

        if (
            !filters.location &&
            filters.search &&
            !checkSearch(plan, filters.search)
        ) {
            return false;
        }

        if (filters.topic.length > 0 && !checkTopic(plan, filters.topic)) {
            return false;
        }

        if (
            filters.interventionLocation.length > 0 &&
            !checkInterventionLocation(plan, filters.interventionLocation)
        ) {
            return false;
        }

        return true;
    });
}

function checkSearch(plan, search) {
    return !!plan.name?.match(new RegExp(search, "ig"));
}

function checkLocation(plan, filters) {
    if (!filters.location) {
        return true;
    }

    const l = plan[filters.location.typeUid];

    if (!l) {
        return false;
    }

    if (l.code === `${filters.location.code}`) {
        return true;
    }

    return l.main === `${filters.location.code}`;
}

function checkTopic(plan, filters) {
    return plan.topics.some(({ uid }) => filters.includes(uid));
}

function checkInterventionLocation(plan, filters) {
    return filters.includes(plan.location_type.id);
}
