/**
 * Enriches the given town with computed properties
 *
 * @param {Shantytown} shantytowns
 *
 * @returns {EnrichedShantytown}
 */

import policeSiren from "@/assets/img/police_siren.svg";
import formatDateSince from "./formatDateSince";
import getLabelForLivingConditionDetail from "./getLabelForLivingConditionDetail";

export default function (shantytown, fieldTypes) {
    const fieldTypeColors = fieldTypes.reduce(
        (acc, fieldType) =>
            Object.assign(acc, {
                [fieldType.id]: fieldType.color,
            }),
        {}
    );

    // justice statuses
    const justiceStatuses = [];

    if (shantytown.ownerComplaint === true) {
        justiceStatuses.push({
            icon: "scroll",
            label: "Plainte déposée",
        });
    }

    if (
        shantytown.justiceProcedure &&
        !shantytown.justiceChallenged &&
        !shantytown.justiceRendered
    ) {
        justiceStatuses.push({
            icon: "balance-scale",
            label: "Procédure en cours",
        });
    }

    if (shantytown.justiceProcedure && shantytown.justiceRendered) {
        justiceStatuses.push({
            icon: "balance-scale",
            label: "Décision rendue",
            date: shantytown.justiceRenderedAt,
        });
    }

    if (shantytown.justiceProcedure && shantytown.justiceChallenged === true) {
        justiceStatuses.push({
            icon: "balance-scale",
            label: "Contentieux",
        });
    }

    switch (shantytown.policeStatus) {
        case "none":
            justiceStatuses.push({
                img: policeSiren,
                label: "Concours de la force publique non demandé",
            });
            break;

        case "requested":
            justiceStatuses.push({
                img: policeSiren,
                label: "Concours de la force publique demandé",
                date: shantytown.policeRequestedAt,
            });
            break;

        case "granted":
            justiceStatuses.push({
                img: policeSiren,
                label: "Concours de la force publique accordé",
                date: shantytown.policeGrantedAt,
            });
            break;

        default:
        case null:
            break;
    }

    switch (shantytown.insalubrityOrderDisplayed) {
        case "none":
            justiceStatuses.push({
                img: policeSiren,
                label: "Arrêté d'insalubrité non pris",
            });
            break;

        case "displayed":
            justiceStatuses.push({
                img: policeSiren,
                label: "Evacuation sous délai prescrite",
                date: shantytown.insalubrityOrderDisplayedAt,
            });
            break;

        case "evacuated":
            justiceStatuses.push({
                img: policeSiren,
                label: "Evacuation sous délai accordée",
                date: shantytown.administrativeOrderEvacuationAt,
            });
            break;

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
    const totalSolutions = (shantytown.closingSolutions || []).reduce(
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
    const conditions = [
        "water",
        "electricity",
        "trash",
        "sanitary",
        "firePrevention",
        "fire_prevention",
        "vermin",
        "pest_animals",
    ];
    conditions.forEach((conditionKey) => {
        if (!livingConditions[conditionKey]) {
            return;
        }

        const status = livingConditions[conditionKey].status;

        ["positive", "negative", "unknown"].forEach(
            (statusKey) =>
                (status[statusKey] = (status[statusKey] || []).map((key) =>
                    getLabelForLivingConditionDetail(
                        conditionKey,
                        key,
                        statusKey,
                        shantytown
                    )
                ))
        );
    });

    return {
        ...shantytown,
        statusName,
        statusDate,
        statusSince,
        statusDetails: statusDetails[shantytown.status],
        fieldType: {
            ...shantytown.fieldType,
            color: fieldTypeColors[shantytown.fieldType.id],
        },
        livingConditions,
        justiceStatuses,
        totalSolutions,
    };
}

const statusDetails = {
    resorbed: "Résorption progressive du site",
    closed_by_justice:
        "Décision de justice suite à une plainte du propriétaire",
    closed_by_pref_admin: "Décision administrative de la Préfecture",
    closed_by_city_admin: "Décision administrative de la Commune",
    other: "Autre",
    unknown: "Raison inconnue",
};
