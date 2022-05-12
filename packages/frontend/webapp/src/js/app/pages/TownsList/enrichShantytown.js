/**
 * Enriches the given town with computed properties
 *
 * @param {Shantytown} shantytowns
 *
 * @returns {EnrichedShantytown}
 */

import policeSiren from "./assets/police_siren.svg";
import formatDateSince from "./formatDateSince";

export default function enrichShantytown(shantytown, fieldTypes) {
    const fieldTypeColors = fieldTypes.reduce(
        (acc, fieldType) =>
            Object.assign(acc, {
                [fieldType.id]: fieldType.color
            }),
        {}
    );

    // electricity
    let electricityValue = null;
    if (
        shantytown.livingConditions.electricity.type &&
        shantytown.livingConditions.electricity.type.label
    ) {
        if (
            shantytown.livingConditions.electricity.type.label.startsWith("Oui")
        ) {
            electricityValue = true;
        } else if (
            shantytown.livingConditions.electricity.type.label === "Non"
        ) {
            electricityValue = false;
        }
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

    const statusSince = statusDate ? formatDateSince(statusDate) : "";

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
    const livingConditions = { ...shantytown.livingConditions };
    livingConditions.electricity.type.value = electricityValue;

    return {
        ...shantytown,
        statusName,
        statusDate,
        statusSince,
        statusDetails: statusDetails[shantytown.status],
        fieldType: {
            ...shantytown.fieldType,
            color: fieldTypeColors[shantytown.fieldType.id]
        },
        livingConditions,
        justiceStatuses,
        totalSolutions
    };
}

const statusDetails = {
    closed_by_justice: "Exécution d'une décision de justice",
    closed_by_admin: "Exécution d'une décision administrative",
    other: "Autre",
    unknown: "Raison inconnue"
};
