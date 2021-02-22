export function formatLivingConditions(town) {
    const result = {
        water: {
            negative: [],
            positive: [],
            unknown: []
        },
        sanitary: {
            negative: [],
            positive: [],
            unknown: []
        },
        trash: {
            negative: [],
            positive: [],
            unknown: []
        },
        firePrevention: {
            negative: [],
            positive: [],
            unknown: []
        }
    };

    // Water
    if (town.waterPotable !== null) {
        town.waterPotable
            ? result.water.positive.push("Eau potable")
            : result.water.negative.push("Eau non potable");
    } else {
        result.water.unknown.push("Eau potable");
    }

    if (town.waterContinuousAccess !== null) {
        town.waterContinuousAccess
            ? result.water.positive.push(
                  "Accès continu, c’est-à-dire qu’il ne varie pas en qualité et quantité dans la journée et les saisons, sans limite dans le temps"
              )
            : result.water.negative.push(
                  "Accès non continu, c’est-à-dire qu’il varie en qualité et quantité dans la journée et les saisons, sans limite dans le temps"
              );
    } else {
        result.water.unknown.push("Accès à l'eau continu");
    }

    if (town.waterPotable !== null) {
        town.waterPublicPoint &&
            result.water.negative.push("Point d'eau public");
    } else {
        result.water.unknown.push("Point d'eau public");
    }

    if (town.waterDistance !== null) {
        // TODO: Fix water distance type
        town.waterDistance <= 20
            ? result.water.positive.push(
                  "Accès situé sur site ou à moins de 20 mètres"
              )
            : result.water.negative.push("Accès situé à plus de 20 mètres");
    } else {
        result.water.unknown.push("Accès situé sur site");
    }

    if (town.waterRoadsToCross !== null) {
        !town.waterRoadsToCross
            ? result.water.positive.push(
                  "Pas de franchissement de rue ou route pour accéder aux points d’eau"
              )
            : result.water.negative.push(
                  "Franchissement de rue ou route nécessaire"
              );
    } else {
        result.water.unknown.push("Franchissement de rue ou route nécessaire");
    }

    if (town.waterEveryoneHasAccess !== null) {
        town.waterEveryoneHasAccess
            ? result.water.positive.push("Accès pour tous les habitants")
            : result.water.negative.push("Pas d’accès pour tous les habitants");
    } else {
        result.water.unknown.push("Accès pour tous les habitants");
    }

    if (town.waterStagnantWater !== null) {
        !town.waterStagnantWater
            ? result.water.positive.push(
                  "Pas d’eaux stagnantes autour du point de distribution"
              )
            : result.water.negative.push(
                  "Eaux stagnantes autour du point de distribution"
              );
    } else {
        result.water.unknown.push(
            "Eaux stagnantes autour du point de distribution"
        );
    }

    if (town.waterHandWashAccess) {
        town.waterHandWashAccess
            ? result.water.positive.push(
                  `${town.waterHandWashAccessNumber ||
                      "Présence de"} bacs de lavage des mains`
              )
            : result.water.negative.push("Pas de de bacs de lavage des mains");
    } else {
        result.water.unknown.push("Présence de bacs de lavage des mains");
    }

    // Sanitary
    if (town.sanitaryOnSite !== null) {
        town.sanitaryOnSite
            ? result.sanitary.positive.push("Accès sur site")
            : result.sanitary.negative.push("Accès aux abords du site");
    } else {
        result.sanitary.unknown.push("Accès sur site");
    }

    const sanitaryNumberPopulationRatio = Math.floor(
        Number(town.populationTotal) / Number(town.sanitaryOnSite)
    );
    if (town.sanitaryNumber !== null && sanitaryNumberPopulationRatio > 0) {
        const text = `${town.sanitaryNumber} toilettes - soit 1 toilette pour ${town.populationTotal} personnes - il est conseillé au moins 1 toilette pour 20 personnes`;

        sanitaryNumberPopulationRatio < 20
            ? result.sanitary.positive.push(text)
            : result.sanitary.negative.push(text);
    }

    if (town.sanitaryInsalubrious !== null) {
        !town.sanitaryInsalubrious
            ? result.sanitary.positive.push(
                  "Pas de marques de défécation à l’air libre"
              )
            : result.sanitary.negative.push(
                  "Marques de défecation à l’air libre"
              );
    } else {
        result.sanitary.unknown.push("Marques de défecation à l’air libre");
    }

    // Trash
    if (town.trashEvacuationRegular !== null) {
        town.trashEvacuationRegular
            ? result.trash.positive.push(
                  "Collecte régulière des poubelles / bennes. C’est-à-dire au moins une fois par semaine, à partir d’un point de dépôt spécialement aménagé sur le site ou à proximité immédiate"
              )
            : result.trash.negative.push(
                  "Pas de collecte régulière des poubelles / bennes"
              );
    } else {
        result.trash.unknown.push("Collecte régulière des poubelles / bennes");
    }

    if (town.trashAccumulation !== null) {
        !town.trashAccumulation
            ? result.trash.positive.push(
                  "Pas d’accumulation de déchets sur le site ou aux abords"
              )
            : result.trash.negative.push(
                  "Accumulation de déchets sur le site ou aux abords"
              );
    } else {
        result.trash.unknown.push(
            "Accumulation de déchets sur le site ou aux abords"
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
    } else {
        result.firePrevention.unknown.push(
            "Diagnostic prévention incendie par le SDIS réalisé"
        );
    }

    if (town.firePreventionDevices !== null) {
        town.firePreventionDevices
            ? result.firePrevention.positive.push(
                  "Mesures spécifiques en place"
              )
            : result.firePrevention.negative.push(
                  "Pas de mesure spécifiques (formation, extincteurs...) en place"
              );
    } else {
        result.firePrevention.unknown.push(
            "Mesures spécifiques en place (formation, extincteurs...)"
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
    } else {
        result.firePrevention.unknown.push("Site accessible aux pompiers");
    }

    return result;
}
