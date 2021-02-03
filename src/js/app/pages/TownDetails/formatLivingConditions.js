export function formatLivingConditions(town) {
    const result = {
        water: {
            negative: [],
            positive: []
        },
        sanitary: {
            negative: [],
            positive: []
        },
        trash: {
            negative: [],
            positive: []
        },
        firePrevention: {
            negative: [],
            positive: []
        }
    };

    // Water
    if (town.waterPotable !== null) {
        town.waterPotable
            ? result.water.positive.push("Eau potable")
            : result.water.negative.push("Eau non potable");
    }

    if (town.waterContinuousAccess !== null) {
        town.waterContinuousAccess
            ? result.water.positive.push(
                  "Accès continu, c’est-à-dire qu’il ne varie pas en qualité et quantité dans la journée et les saisons, sans limite dans le temps"
              )
            : result.water.negative.push(
                  "Accès non continu, c’est-à-dire qu’il varie en qualité et quantité dans la journée et les saisons, sans limite dans le temps"
              );
    }

    if (town.waterPotable !== null) {
        town.waterPublicPoint &&
            result.water.positive.push("Point d'eau public");
    }

    if (town.waterDistance !== null) {
        // TODO: Fix water distance type
        town.waterDistance > 20
            ? result.water.positive.push(
                  "Accès situé sur site ou à moins de 20 mètres"
              )
            : result.water.negative.push("Accès situé à plus de 20 mètres");
    }

    if (town.waterRoadsToCross !== null) {
        !town.waterRoadsToCross
            ? result.water.positive.push(
                  "Pas de franchissement de rue ou route pour accéder aux points d’eau"
              )
            : result.water.negative.push(
                  "Franchissement de rue ou route nécessaire"
              );
    }

    if (town.waterEveryoneHasAccess !== null) {
        town.waterEveryoneHasAccess
            ? result.water.positive.push("Accès pour tous les habitants")
            : result.water.negative.push("Pas d’accès pour tous les habitants");
    }

    if (town.waterStagnantWater !== null) {
        !town.waterStagnantWater
            ? result.water.positive.push(
                  "Pas d’eaux stagnantes autour du point de distribution"
              )
            : result.water.negative.push(
                  "Eaux stagnantes autour du point de distribution"
              );
    }

    // TODO : Ajout du nombre de bacs par personnes
    if (town.waterHandWashAccess) {
        town.waterHandWashAccess
            ? result.water.positive.push(
                  `${town.waterHandWashAccessNumber ||
                      "Présence de"} bacs de lavage des mains`
              )
            : result.water.negative.push("Pas de de bacs de lavage des mains");
    }

    // Sanitary
    if (town.sanitaryOnSite !== null) {
        town.sanitaryOnSite
            ? result.sanitary.positive.push("Accès sur site")
            : result.sanitary.negative.push("Accès aux abords du site.");
    }

    if (town.sanitaryInsalubrious !== null) {
        !town.sanitaryInsalubrious
            ? result.sanitary.positive.push(
                  "Pas de marques de défécation à l’air libre"
              )
            : result.sanitary.negative.push(
                  "Marques de défecation à l’air libre"
              );
    }

    // Trash
    if (town.trashEvacuationRegular !== null) {
        town.trashEvacuationRegular
            ? result.trash.positive.push(
                  "Collecte régulière des poubelles / bennes. C’est-à-dire au moins une fois par semaine, à partir d’un point de dépôt spécialement aménagé sur le site ou à proximité immédiate."
              )
            : result.trash.negative.push(
                  "Pas de collecte régulière des poubelles / bennes."
              );
    }

    if (town.trashAccumulation !== null) {
        !town.trashAccumulation
            ? result.trash.positive.push(
                  "Pas d’accumulation de déchets sur le site ou aux abords."
              )
            : result.trash.negative.push(
                  "Accumulation de déchets sur le site ou aux abords."
              );
    }

    // Fire
    if (town.firePreventionDiagnostic !== null) {
        town.firePreventionDiagnostic
            ? result.firePrevention.positive.push(
                  "Diagnostic prévention incendie par le SDIS réalisé"
              )
            : result.firePrevention.negative.push(
                  "Pas de diagnostic prévention incendie réalisé par le SDIS"
              );
    }

    if (town.firePreventionSiteAccessible !== null) {
        town.firePreventionSiteAccessible
            ? result.firePrevention.positive.push(
                  "Site accessible aux pompiers"
              )
            : result.firePrevention.negative.push(
                  "Site pas accessible aux pompiers"
              );
    }

    // TODO : Mesures spécifiques

    return result;
}
