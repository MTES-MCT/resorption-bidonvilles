// Chaque entrée décrit un filtre : `isActive` indique si le filtre est
// renseigné, `predicate` teste si une action doit être conservée.
// Une action est retenue uniquement si elle passe tous les filtres actifs.
function buildActiveFilters(filters) {
    const now = new Date();
    const searchRegex = filters.search
        ? new RegExp(filters.search, "ig")
        : null;
    const isOrganizationLocation = filters.location?.type === "organization";

    const definitions = [
        {
            isActive: filters.organizationId !== undefined,
            predicate: (action) =>
                checkUserOrganization(action, filters.organizationId),
        },
        {
            isActive: isOrganizationLocation,
            predicate: (action) =>
                checkOrganization(action, filters.location.organizationId),
        },
        {
            isActive: !isOrganizationLocation,
            predicate: (action) => checkLocation(action, filters),
        },
        {
            isActive: !!filters.status,
            predicate: (action) => checkStatus(action, filters.status, now),
        },
        {
            isActive: !filters.location && !!filters.search,
            predicate: (action) => checkSearch(action, searchRegex),
        },
        {
            isActive: filters.topic?.length > 0,
            predicate: (action) => checkTopic(action, filters.topic),
        },
        {
            isActive: filters.interventionLocation?.length > 0,
            predicate: (action) =>
                checkInterventionLocation(action, filters.interventionLocation),
        },
        {
            isActive: filters.dihalFinancing?.length > 0,
            predicate: (action) =>
                checkDihalFinancing(action, filters.dihalFinancing),
        },
    ];

    return definitions
        .filter(({ isActive }) => isActive)
        .map(({ predicate }) => predicate);
}

export default function filterActions(actions, filters) {
    const activeFilters = buildActiveFilters(filters);
    return actions.filter((action) =>
        activeFilters.every((predicate) => predicate(action))
    );
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
                name.match(searchRegex) || abbreviation?.match(searchRegex)
        ) ||
        !!action.managers?.find(
            ({ name, abbreviation }) =>
                name.match(searchRegex) || abbreviation?.match(searchRegex)
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
