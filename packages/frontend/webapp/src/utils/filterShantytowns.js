import isShantytownClosed from "./isShantytownClosed";
import isShantytownSolved from "./isShantytownSolved";

export default function (shantytowns, filters) {
    return shantytowns.filter((shantytown) => {
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
            !filters.location &&
            filters.search &&
            !checkSearch(shantytown, filters.search)
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
            filters.fieldType.length > 0 &&
            !checkFieldType(shantytown, filters.fieldType)
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
            filters.administrativeOrder.length > 0 &&
            !checkAdministrativeOrder(shantytown, filters.administrativeOrder)
        ) {
            return false;
        }

        if (filters.rhi.length > 0 && !checkRhi(shantytown, filters.rhi)) {
            return false;
        }

        if (
            filters.origin.length > 0 &&
            !checkOrigin(shantytown, filters.origin)
        ) {
            return false;
        }

        if (
            filters.target.length > 0 &&
            !checkTarget(shantytown, filters.target)
        ) {
            return false;
        }

        // Filtres spécifiques aux sites ouverts
        if (
            filters.status === "open" &&
            filters.conditions.length > 0 &&
            !checkConditions(shantytown, filters.conditions)
        ) {
            return false;
        }

        if (
            filters.status === "open" &&
            filters.actors.length > 0 &&
            !checkActors(shantytown, filters.actors)
        ) {
            return false;
        }

        if (
            filters.status === "open" &&
            filters.heatwave.length > 0 &&
            !checkHeatwave(shantytown, filters.heatwave)
        ) {
            return false;
        }

        // Filtres spécifiques aux sites fermés
        if (
            filters.status === "close" &&
            filters.closingReason.length > 0 &&
            !checkClosingReason(shantytown, filters.closingReason)
        ) {
            return false;
        }

        if (
            filters.status === "close" &&
            filters.solvedOrClosed.length > 0 &&
            !checkSolvedOrClosed(shantytown, filters.solvedOrClosed)
        ) {
            return false;
        }
        return true;
    });
}

function checkConditions(shantytown, filters) {
    return filters.some((filter) => {
        let filterToCondition = {
            accessToSanitary: ["sanitary"],
            accessToWater: ["water"],
            accessToTrash: ["trash"],
            accessToElectricity: ["electricity"],
            vermin: ["vermin", "pest_animals"],
            firePreventionMeasures: ["firePrevention", "fire_prevention"],
        };

        return filterToCondition[filter].some(
            (key) =>
                shantytown.livingConditions[key] &&
                ["bad", "unknown"].includes(
                    shantytown.livingConditions[key].status.status
                )
        );
    });
}

function checkOrigin(shantytown, filters) {
    if (!shantytown.socialOrigins) {
        return false;
    }

    if (!shantytown.socialOrigins.length && filters.includes("unknown")) {
        return true;
    }

    // Cas spécifique où le site n'est occupé que par des ressortissants européens
    if (filters.includes("0")) {
        return (
            shantytown.socialOrigins.length === 1 &&
            shantytown.socialOrigins[0].id.toString() === "2"
        );
    }

    const origins = shantytown.socialOrigins.map((origin) => origin.id);

    const filteredArray = origins.filter((value) =>
        filters.includes(value.toString())
    );

    return filteredArray.length;
}

function checkSearch(shantytown, search) {
    const locations = [
        shantytown.region?.name,
        shantytown.departement?.name,
        shantytown.epci?.name,
        shantytown.city?.name,
    ]
        .filter((val) => val !== undefined)
        .join(" ");

    return (
        !!shantytown.name?.match(new RegExp(search, "ig")) ||
        !!shantytown.address?.match(new RegExp(search, "ig")) ||
        !!locations.match(new RegExp(search, "ig"))
    );
}

function checkLocation(shantytown, filters) {
    if (!filters.location) {
        return true;
    }

    const overseasRegions = ["01", "02", "03", "04", "06"];
    if (filters.location.typeUid === "metropole") {
        return !overseasRegions.includes(shantytown.region?.code);
    }

    if (filters.location.typeUid === "outremer") {
        return overseasRegions.includes(shantytown.region.code);
    }

    const l = shantytown[filters.location.typeUid];

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
    return filters.indexOf(shantytown.fieldType.id.toString()) !== -1;
}

/**
 *
 */
function checkPopulation(shantytown, filters) {
    return filters.some((value) => {
        if (value === "unknown") {
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
    return filters.some((value) => {
        if (value === "ownerComplaint") {
            return shantytown.ownerComplaint === true;
        }

        if (value === "justiceProcedure") {
            return shantytown.justiceProcedure === true;
        }

        if (value === "justiceRendered") {
            return shantytown.justiceRendered === true;
        }

        if (value === "none") {
            return (
                shantytown.ownerComplaint === false &&
                shantytown.justiceProcedure === false
            );
        }

        // value === null (inconnu)
        return (
            typeof shantytown.ownerComplaint !== "boolean" &&
            typeof shantytown.justiceProcedure !== "boolean"
        );
    });
}

function checkAdministrativeOrder(shantytown, filters) {
    return filters.some((value) => {
        if (value === "evacuationUnderTimeLimit") {
            return shantytown.evacuationUnderTimeLimit === true;
        }

        if (value === "none") {
            return shantytown.evacuationUnderTimeLimit === false;
        }

        return typeof shantytown.evacuationUnderTimeLimit !== "boolean";
    });
}

function checkRhi(shantytown, filters) {
    return filters.some((value) => {
        if (value === "insalubrityOrder") {
            return shantytown.insalubrityOrder === true;
        }

        if (value === "none") {
            return shantytown.insalubrityOrder === false;
        }

        return typeof shantytown.insalubrityOrder !== "boolean";
    });
}

/**
 * Filter on closingReasons
 */
function checkClosingReason(shantytown, filters) {
    if (filters.includes(shantytown.status)) {
        return true;
    }

    return false;
}

/**
 * Filter on "solved or closed ?"
 */
function checkSolvedOrClosed(shantytown, filters) {
    if (filters.includes("solved") && isShantytownSolved(shantytown)) {
        return true;
    }
    if (filters.includes("closed") && isShantytownClosed(shantytown)) {
        return true;
    }
    return false;
}

/**
 *
 */
function checkActors(shantytown, filters) {
    if (filters.includes("yes") && shantytown.actors.length > 0) {
        return true;
    }

    if (filters.includes("no") && shantytown.actors.length === 0) {
        return true;
    }

    return filters.length === 0;
}

/**
 *
 */
function checkTarget(shantytown, filters) {
    if (filters.includes("yes") && shantytown.resorptionTarget !== null) {
        return true;
    }

    if (filters.includes("no") && shantytown.resorptionTarget === null) {
        return true;
    }

    return filters.length === 0;
}

/**
 *
 */
function checkHeatwave(shantytown, filters) {
    if (filters.includes("yes") && shantytown.heatwaveStatus === true) {
        return true;
    }

    if (filters.includes("no") && shantytown.heatwaveStatus === false) {
        return true;
    }

    return filters.length === 0;
}
