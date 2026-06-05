export default function filterActions(actions, filters) {
    const now = new Date();
    const searchRegex = filters.search
        ? new RegExp(filters.search, "ig")
        : null;

    return actions.filter((action) => {
        if (
            filters.organizationId !== undefined &&
            !checkUserOrganization(action, filters.organizationId)
        ) {
            return false;
        }

        if (
            filters.location?.type === "organization" &&
            !checkOrganization(action, filters.location.organizationId)
        ) {
            return false;
        }

        if (
            filters.location?.type !== "organization" &&
            !checkLocation(action, filters)
        ) {
            return false;
        }

        if (filters.status && !checkStatus(action, filters.status, now)) {
            return false;
        }

        if (
            !filters.location &&
            filters.search &&
            !checkSearch(action, searchRegex)
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

        if (
            filters.dihalFinancing.length > 0 &&
            !checkDihalFinancing(action, filters.dihalFinancing)
        ) {
            return false;
        }

        return true;
    });
}

function checkStatus(action, status, now) {
    if (status === "open") {
        return action.ended_at === null || now < action.ended_at;
    }

    return action.ended_at !== null && now > action.ended_at;
}

function checkSearch(action, searchRegex) {
    return (
        !!action.name?.match(searchRegex) ||
        !!action.operators?.find(
            ({ name, abbreviation }) =>
                name.match(searchRegex) ||
                (abbreviation && abbreviation.match(searchRegex))
        ) ||
        !!action.managers?.find(
            ({ name, abbreviation }) =>
                name.match(searchRegex) ||
                (abbreviation && abbreviation.match(searchRegex))
        )
    );
}

const overseasRegions = new Set(["01", "02", "03", "04", "06"]);
function checkLocation(action, filters) {
    if (!filters.location) {
        return true;
    }

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

function checkUserOrganization(action, organizationId) {
    const allUsers = [...action.operators.flatMap((org) => org.users)];
    return allUsers.some((u) => u.organization.id === organizationId);
}

function checkOrganization(action, organizationId) {
    return action.operators?.some((op) => op.id === organizationId);
}

function checkDihalFinancing(action, dihalFinancingFilters) {
    if (dihalFinancingFilters.includes("all")) {
        return Object.values(action.finances || {}).some((financeLines) =>
            financeLines.some((line) => line.type?.uid === "dedie")
        );
    }

    return Object.entries(action.finances || {}).some(
        ([year, financeLines]) =>
            dihalFinancingFilters.includes(String(year)) &&
            financeLines.some((line) => line.type?.uid === "dedie")
    );
}
