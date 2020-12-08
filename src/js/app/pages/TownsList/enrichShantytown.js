/**
 * Enriches the given town with computed properties
 *
 * @param {Shantytown} shantytowns
 *
 * @returns {EnrichedShantytown}
 */

import policeSiren from "./assets/police_siren.svg";

export default function enrichShantytown(shantytown, fieldTypes) {
    const fieldTypeColors = fieldTypes.reduce(
        (acc, fieldType) =>
            Object.assign(acc, {
                [fieldType.id]: fieldType.color
            }),
        {}
    );

    // electricity
    let electricityValue = true;
    if (shantytown.electricityType.label === "Inconnu") {
        electricityValue = null;
    } else if (shantytown.electricityType.label === "Non") {
        electricityValue = false;
    }

    // justice statuses
    const justiceStatuses = [];

    if (shantytown.ownerComplaint === true) {
        justiceStatuses.push({
            icon: "scroll",
            label: "Plainte déposée"
        });
    }

    if (
        shantytown.justiceProcedure &&
        !shantytown.justiceChallenged &&
        !shantytown.justiceRendered
    ) {
        justiceStatuses.push({
            icon: "balance-scale",
            label: "Procédure en cours"
        });
    }

    if (shantytown.justiceProcedure && shantytown.justiceRendered) {
        justiceStatuses.push({
            icon: "balance-scale",
            label: "Décision rendue",
            date: shantytown.justiceRenderedAt
        });
    }

    if (shantytown.justiceProcedure && shantytown.justiceChallenged === true) {
        justiceStatuses.push({
            icon: "balance-scale",
            label: "Contentieux"
        });
    }

    switch (shantytown.policeStatus) {
        case "none":
            justiceStatuses.push({
                img: policeSiren,
                label: "Concours de la force publique non demandé"
            });
            break;

        case "requested":
            justiceStatuses.push({
                img: policeSiren,
                label: "Concours de la force publique demandé",
                date: shantytown.policeRequestedAt
            });
            break;

        case "granted":
            justiceStatuses.push({
                img: policeSiren,
                label: "Concours de la force publique accordé",
                date: shantytown.policeGrantedAt
            });
            break;

        default:
        case null:
            break;
    }

    // status
    let statusName;
    let statusDate;
    const statusSince = [];
    if (shantytown.status === "open") {
        if (shantytown.builtAt) {
            statusName = "Existe";
            statusDate = shantytown.builtAt;
        } else if (shantytown.declaredAt) {
            statusName = "Signalé";
            statusDate = shantytown.declaredAt;
        } else {
            statusName = null;
            statusDate = null;
        }
    } else {
        statusName = "Fermé";
        statusDate = shantytown.closedAt;
    }

    if (statusDate !== null) {
        const { years, months } = getSince(statusDate);
        if (years > 0) {
            statusSince.push(`${years} an${years > 1 ? "s" : ""}`);
        }

        if (years > 0 && months > 0) {
            statusSince.push(`et`);
        }

        if (months > 0) {
            statusSince.push(`${months} mois`);
        }
    }

    // closing solutions
    const totalSolutions = shantytown.closingSolutions.reduce(
        (total, solution) => {
            if (!solution.householdsAffected) {
                return total;
            }

            return (total || 0) + solution.householdsAffected;
        },
        null
    );

    // final object
    return {
        ...shantytown,
        statusName,
        statusDate,
        statusSince: statusSince.join(" "),
        statusDetails: statusDetails[shantytown.status],
        fieldType: {
            ...shantytown.fieldType,
            color: fieldTypeColors[shantytown.fieldType.id]
        },
        electricityType: {
            ...shantytown.electricityType,
            value: electricityValue
        },
        justiceStatuses,
        totalSolutions
    };
}

function getSince(ts) {
    const now = new Date();
    const then = new Date(ts * 1000);

    let months = 0;
    if (now.getFullYear() === then.getFullYear()) {
        months = Math.max(0, now.getMonth() - then.getMonth());
    } else if (now.getFullYear() > then.getFullYear()) {
        const diff = now.getFullYear() - then.getFullYear();
        months = (diff - 1) * 12 + (now.getMonth() + 12 - then.getMonth());
    }

    return {
        years: Math.floor(months / 12),
        months: months % 12
    };
}

const statusDetails = {
    closed_by_justice: "Exécution d'une décision de justice",
    closed_by_admin: "Exécution d'une décision administrative",
    other: "Autre",
    unknown: "Raison inconnue"
};
