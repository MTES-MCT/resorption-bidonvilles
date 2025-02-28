/**
 * Enriches the given town with computed properties
 *
 * @param {Shantytown} shantytowns
 *
 * @returns {EnrichedShantytown}
 */

import formatDateSince from "./formatDateSince";
import getLabelForLivingConditionDetail from "./getLabelForLivingConditionDetail";
import { getTownLastUpdatedAt } from "@/utils/townLastUpdateManager";

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
            section: "ownerComplaint",
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
            section: "justiceProcedure",
            icon: "balance-scale",
            label: "Procédure judiciaire en cours",
        });
    }

    if (shantytown.justiceProcedure && shantytown.justiceRendered) {
        justiceStatuses.push({
            section: "justiceProcedure",
            icon: "balance-scale",
            label: "Décision de justice rendue",
            date: shantytown.justiceRenderedAt,
        });
    }

    if (shantytown.justiceProcedure && shantytown.justiceChallenged === true) {
        justiceStatuses.push({
            section: "justiceProcedure",
            icon: "handshake",
            label: "Appel à la décision de justice en cours",
        });
    }

    // Procédure administrative prescrivant l'évacuation sous délai
    if (shantytown.evacuationUnderTimeLimit === true) {
        if (shantytown.administrativeOrderEvacuationAt !== null) {
            justiceStatuses.push({
                section: "evacuationUnderTimeLimit",
                icon: "file-contract",
                label: "Évacuation planifiée",
                date: shantytown.administrativeOrderEvacuationAt,
            });
        }
        if (
            shantytown.administrativeOrderDecisionAt !== null &&
            shantytown.administrativeOrderEvacuationAt === null
        ) {
            justiceStatuses.push({
                section: "evacuationUnderTimeLimit",
                icon: "file-contract",
                label: "Arrêté d'évacuation pris",
                date: shantytown.administrativeOrderDecisionAt,
            });
        }
        if (
            shantytown.administrativeOrderEvacuationAt === null &&
            shantytown.administrativeOrderDecisionAt === null
        ) {
            justiceStatuses.push({
                section: "evacuationUnderTimeLimit",
                icon: "file-contract",
                label: "Arrêté d'évacuation en cours",
            });
        }
    }

    // Arrêté d'insalubritéalubrité dans le cadre d'une opération RHI bidonville
    if (shantytown.insalubrityOrder) {
        if (shantytown.insalubrityOrderAt) {
            if (shantytown.insalubrityOrderType) {
                justiceStatuses.push({
                    section: "insalubrityOrder",
                    icon: "right-from-bracket",
                    label: "Arrêté d'insalubrité pris",
                    date: shantytown.insalubrityOrderAt,
                });
            } else {
                justiceStatuses.push({
                    section: "insalubrityOrder",
                    icon: "right-from-bracket",
                    label: "Arrêté d'insalubrité pris",
                    date: shantytown.insalubrityOrderAt,
                });
            }
        } else {
            justiceStatuses.push({
                section: "insalubrityOrder",
                icon: "right-from-bracket",
                label: "Arrêté d'insalubrité en cours",
            });
        }
    }

    // Concours de la force publique
    switch (shantytown.policeStatus) {
        case "none":
            justiceStatuses.push({
                section: "policeStatus",
                icon: "user-police",
                label: "Concours de la force publique non demandé",
            });
            break;

        case "requested":
            justiceStatuses.push({
                section: "policeStatus",
                icon: "user-police",
                label: "Concours de la force publique demandé",
                date: shantytown.policeRequestedAt,
            });
            break;

        case "granted":
            justiceStatuses.push({
                section: "policeStatus",
                icon: "user-police",
                label: "Concours de la force publique accordé",
                date: shantytown.policeGrantedAt,
            });
            break;

        case "refused":
            justiceStatuses.push({
                section: "policeStatus",
                icon: "user-police",
                label: "Concours de la force publique refusé",
                date: shantytown.policeGrantedAt,
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

    const lastUpdatedAt = getTownLastUpdatedAt(shantytown);

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
        lastUpdatedAt,
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
