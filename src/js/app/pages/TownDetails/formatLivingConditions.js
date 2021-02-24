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

    // Eau potable
    const wordingWaterPotable = "Eau potable";
    if (town.waterPotable !== null) {
        town.waterPotable
            ? result.water.positive.push({ text: wordingWaterPotable })
            : result.water.negative.push({ text: "Eau non potable" });
    } else {
        result.water.unknown.push({ text: wordingWaterPotable });
    }

    // Eau continu
    const wordingWaterContinuousAccess =
        "Accès continu, c’est-à-dire qu’il ne varie pas en qualité et quantité dans la journée et les saisons, sans limite dans le temps";
    if (town.waterContinuousAccess !== null) {
        town.waterContinuousAccess
            ? result.water.positive.push({ text: wordingWaterContinuousAccess })
            : result.water.negative.push({
                  text:
                      "Accès non continu, c’est-à-dire qu’il varie en qualité et quantité dans la journée et les saisons, sans limite dans le temps"
              });
    } else {
        result.water.unknown.push({ text: wordingWaterContinuousAccess });
    }

    // Point d'eau public
    if (town.waterPublicPoint !== null) {
        town.waterPublicPoint &&
            result.water.negative.push({ text: "Point d'eau public" });
    } else {
        result.water.unknown.push({ text: "Point d'eau public" });
    }

    // Distance du point d'eau
    const wordingWaterDistance = "Accès situé sur site ou à moins de 20 mètres";
    if (town.waterDistance !== null) {
        town.waterDistance <= 20
            ? result.water.positive.push({ text: wordingWaterDistance })
            : result.water.negative.push({
                  text: "Accès situé à plus de 20 mètres"
              });
    } else {
        result.water.unknown.push({ text: "Localisation de l'accès" });
    }

    // Franchissement de rues
    const wordingWaterRoadsToCross =
        "Pas de franchissement de rue ou route pour accéder aux points d’eau";
    if (town.waterRoadsToCross !== null) {
        !town.waterRoadsToCross
            ? result.water.positive.push({ text: wordingWaterRoadsToCross })
            : result.water.negative.push({
                  text: "Franchissement de rue ou route nécessaire"
              });
    } else {
        result.water.unknown.push({ text: wordingWaterRoadsToCross });
    }

    // Acces pour tous
    const wordingWaterEveryoneHasAccess = "Accès pour tous les habitants";
    if (town.waterEveryoneHasAccess !== null) {
        town.waterEveryoneHasAccess
            ? result.water.positive.push({
                  text: wordingWaterEveryoneHasAccess
              })
            : result.water.negative.push({
                  text: "Pas d’accès pour tous les habitants"
              });
    } else {
        result.water.unknown.push({ text: wordingWaterEveryoneHasAccess });
    }

    // Eau stagnante
    const wordingWaterStagnantWater =
        "Pas d’eaux stagnantes autour du point de distribution";
    if (town.waterStagnantWater !== null) {
        !town.waterStagnantWater
            ? result.water.positive.push({ text: wordingWaterStagnantWater })
            : result.water.negative.push({
                  text: "Eaux stagnantes autour du point de distribution"
              });
    } else {
        result.water.unknown.push({ text: wordingWaterStagnantWater });
    }

    // Présence de bacs de lavage & nombre
    const waterHandWashAccessPopulationRatio =
        town.populationTotal && town.waterHandWashAccessNumber
            ? Math.floor(
                  Number(town.populationTotal) /
                      Number(town.waterHandWashAccessNumber)
              )
            : null;
    const wordingRatio = waterHandWashAccessPopulationRatio
        ? ` - soit 1 bac de lavage pour ${waterHandWashAccessPopulationRatio} personnes`
        : "";
    const wordingWaterHandWashAccess = `${town.waterHandWashAccessNumber ||
        "Présence de"} bac${
        town.waterHandWashAccessNumber > 1 ? "s" : ""
    } de lavage des mains${wordingRatio}`;
    const infoWaterHandWashAccess =
        "il est conseillé au moins 1 bac de lavage pour 20 personnes";

    if (
        town.waterHandWashAccess &&
        waterHandWashAccessPopulationRatio &&
        waterHandWashAccessPopulationRatio < 20
    ) {
        result.water.positive.push({
            text: wordingWaterHandWashAccess,
            info: infoWaterHandWashAccess
        });
    } else if (
        town.waterHandWashAccess &&
        waterHandWashAccessPopulationRatio &&
        waterHandWashAccessPopulationRatio > 20
    ) {
        result.water.negative.push({
            text: wordingWaterHandWashAccess,
            info: infoWaterHandWashAccess
        });
    } else if (
        town.waterHandWashAccess &&
        !waterHandWashAccessPopulationRatio
    ) {
        result.water.positive.push({
            text: wordingWaterHandWashAccess
        });
    } else if (town.waterHandWashAccess === false) {
        result.water.negative.push({
            text: "Pas de de bacs de lavage des mains",
            info: infoWaterHandWashAccess
        });
    } else {
        result.water.unknown.push({
            text: wordingWaterHandWashAccess,
            info: infoWaterHandWashAccess
        });
    }

    // Toilettes sur site
    const wordingSanitaryOnSite = "Accès sur site";
    if (town.sanitaryOnSite !== null) {
        town.sanitaryOnSite
            ? result.sanitary.positive.push({ text: wordingSanitaryOnSite })
            : result.sanitary.negative.push({
                  text: "Accès aux abords du site"
              });
    } else {
        result.sanitary.unknown.push({ text: wordingSanitaryOnSite });
    }

    // Nombre de toilettes & Ratio
    const sanitaryNumberPopulationRatio = Math.floor(
        Number(town.populationTotal) / Number(town.sanitaryNumber)
    );
    const wordingSanitaryRatio = town.sanitaryNumber
        ? ` - soit 1 toilette pour ${sanitaryNumberPopulationRatio} personnes`
        : "";
    const wordingSanitaryNumber = `${town.sanitaryNumber ||
        "Présence de"} toilette${
        town.sanitaryNumber > 1 ? "s" : ""
    }${wordingSanitaryRatio}`;
    const infoSanitaryNumber =
        "il est conseillé au moins 1 toilette pour 20 personnes";

    if (town.sanitaryNumber && sanitaryNumberPopulationRatio < 20) {
        result.sanitary.positive.push({
            text: wordingSanitaryNumber,
            info: infoSanitaryNumber
        });
    } else if (town.sanitaryNumber && sanitaryNumberPopulationRatio > 20) {
        result.sanitary.negative.push({
            text: wordingSanitaryNumber,
            info: infoSanitaryNumber
        });
    } else {
        result.sanitary.unknown.push({
            text: "Nombre de toilettes",
            info: infoSanitaryNumber
        });
    }

    // Sanitaire Insalubre
    const wordingSanitaryInsalubrious =
        "Pas de marques de défécation à l’air libre";
    if (town.sanitaryInsalubrious !== null) {
        !town.sanitaryInsalubrious
            ? result.sanitary.positive.push({
                  text: wordingSanitaryInsalubrious
              })
            : result.sanitary.negative.push({
                  text: "Marques de défecation à l’air libre"
              });
    } else {
        result.sanitary.unknown.push({ text: wordingSanitaryInsalubrious });
    }

    // Nombre de poubelles/bennes
    const trashCansRatio = Math.floor(
        Number(town.populationTotal) / Number(town.trashCansOnSite)
    );
    if (town.trashCansOnSite !== null) {
        result.trash.positive.push({
            text: `${town.trashCansOnSite} poubelle${
                town.trashCansOnSite > 1 ? "s" : ""
            } / benne${
                town.trashCansOnSite > 1 ? "s" : ""
            } sont à proximité immédiate du site (moins de 100 mètres) - soit 1 pour ${trashCansRatio} personnes`
        });
    } else {
        result.trash.unknown.push({
            text:
                "Nombre de poubelles / bennes à proximité immédiate du site (moins de 100 mètres)"
        });
    }

    // Evacuation régulière des déchets
    const wordingTrashEvacuationRegular =
        "Collecte régulière des poubelles / bennes. C’est-à-dire au moins une fois par semaine, à partir d’un point de dépôt spécialement aménagé sur le site ou à proximité immédiate";
    if (town.trashEvacuationRegular !== null) {
        town.trashEvacuationRegular
            ? result.trash.positive.push({
                  text: wordingTrashEvacuationRegular
              })
            : result.trash.negative.push({
                  text: "Pas de collecte régulière des poubelles / bennes"
              });
    } else {
        result.trash.unknown.push({ text: wordingTrashEvacuationRegular });
    }

    // Accumulation des déchets
    const wordingTrashAccumulation =
        "Pas d’accumulation de déchets sur le site ou aux abords";
    if (town.trashAccumulation !== null) {
        !town.trashAccumulation
            ? result.trash.positive.push({ text: wordingTrashAccumulation })
            : result.trash.negative.push({
                  text: "Accumulation de déchets sur le site ou aux abords"
              });
    } else {
        result.trash.unknown.push({ text: wordingTrashAccumulation });
    }

    // Diagnostic de prévention
    const wordingFirePreventionDiagnostic =
        "Diagnostic prévention incendie par le SDIS réalisé";
    if (town.firePreventionDiagnostic !== null) {
        town.firePreventionDiagnostic
            ? result.firePrevention.positive.push({
                  text: wordingFirePreventionDiagnostic
              })
            : result.firePrevention.negative.push({
                  text:
                      "Pas de diagnostic prévention incendie réalisé par le SDIS"
              });
    } else {
        result.firePrevention.unknown.push({
            text: wordingFirePreventionDiagnostic
        });
    }

    // Mesure spécifiques
    const wordingFirePreventionDevices = "Mesures spécifiques en place";
    if (town.firePreventionDevices !== null) {
        town.firePreventionDevices
            ? result.firePrevention.positive.push({
                  text: wordingFirePreventionDevices
              })
            : result.firePrevention.negative.push({
                  text:
                      "Pas de mesure spécifiques (formation, extincteurs...) en place"
              });
    } else {
        result.firePrevention.unknown.push({
            text: wordingFirePreventionDevices
        });
    }

    // Site accessible aux pompiers
    const wordingFirePreventionSiteAccessible = "Site accessible aux pompiers";
    if (town.firePreventionSiteAccessible !== null) {
        town.firePreventionSiteAccessible
            ? result.firePrevention.positive.push({
                  text: wordingFirePreventionSiteAccessible
              })
            : result.firePrevention.negative.push({
                  text: "Site pas accessible aux pompiers"
              });
    } else {
        result.firePrevention.unknown.push({
            text: wordingFirePreventionSiteAccessible
        });
    }

    return result;
}
