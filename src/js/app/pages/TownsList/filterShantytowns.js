export function filterShantytowns(shantytowns, filters) {
    return shantytowns.filter(shantytown => {
        if (filters.status === "open" && shantytown.status !== "open") {
            return false;
        }

        if (filters.status === "close" && shantytown.status === "open") {
            return false;
        }

        if (filters.location && !checkLocation(shantytown, filters)) {
            return false;
        }

        if (
            filters.fieldType.length > 0 &&
            !checkFieldType(shantytown, filters.fieldType)
        ) {
            return false;
        }

        if (
            filters.population.length > 0 &&
            !checkPopulation(shantytown, filters.population)
        ) {
            return false;
        }

        if (
            filters.justice.length > 0 &&
            !checkJustice(shantytown, filters.justice)
        ) {
            return false;
        }

        if (
            filters.origin.length > 0 &&
            !checkOrigin(shantytown, filters.origin)
        ) {
            return false;
        }

        if (
            filters.conditions.length > 0 &&
            !checkConditions(shantytown, filters.conditions)
        ) {
            return false;
        }

        return true;
    });
}

function checkConditions(shantytown, filters) {
    return filters.some(filter => {
        if (filter === "accessToSanitary") {
            return !shantytown.accessToSanitary;
        }

        if (filter === "accessToWater") {
            return !shantytown.accessToWater;
        }

        if (filter === "accessToTrash") {
            return !shantytown.trashEvacuation;
        }

        if (filter === "accessToElectricity") {
            return !shantytown.electricityType.value;
        }

        return true;
    });
}

function checkOrigin(shantytown, filters) {
    if (!shantytown.socialOrigins) {
        return false;
    }

    if (!shantytown.socialOrigins.length && filters.includes(null)) {
        return true;
    }

    const origins = shantytown.socialOrigins.map(origin => origin.id);

    const filteredArray = origins.filter(value => filters.includes(value));

    return filteredArray.length;
}

function checkLocation(shantytown, filters) {
    if (filters.location.type === "nation") {
        return true;
    }

    const l = shantytown[filters.location.locationType];

    if (!l) {
        return true;
    }

    if (l.code === `${filters.location.code}`) {
        return true;
    }

    return l.main === `${filters.location.code}`;
}

/**
 *
 */
function checkFieldType(shantytown, filters) {
    return filters.indexOf(shantytown.fieldType.id) !== -1;
}

/**
 *
 */
function checkPopulation(shantytown, filters) {
    return filters.some(value => {
        if (value === null) {
            return shantytown.populationTotal === null;
        }

        if (shantytown.populationTotal === null) {
            return false;
        }

        const [min, max] = value.split("-");
        if (min !== "" && parseInt(min, 10) > shantytown.populationTotal) {
            return false;
        }

        if (max !== "" && parseInt(max, 10) < shantytown.populationTotal) {
            return false;
        }

        return true;
    });
}

/**
 *
 */
function checkJustice(shantytown, filters) {
    return filters.some(value => {
        if (value === "ownerComplaint") {
            return shantytown.ownerComplaint === true;
        }

        if (shantytown.justiceRendered === true) {
            return value === "justiceRendered";
        }

        if (shantytown.justiceProcedure === true) {
            return value === "justiceProcedure";
        }

        return value === null;
    });
}
