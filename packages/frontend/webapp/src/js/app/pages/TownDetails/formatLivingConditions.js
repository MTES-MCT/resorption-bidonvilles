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
    if (town.livingConditions.water.potable !== null) {
        town.livingConditions.water.potable
            ? result.water.positive.push({ text: wordingWaterPotable })
            : result.water.negative.push({ text: "Eau non potable" });
    } else {
        result.water.unknown.push({ text: wordingWaterPotable });
    }

    // Eau continu
    const wordingWaterContinuousAccess =
        "Accès continu, c’est-à-dire qu’il ne varie pas en qualité et quantité dans la journée et les saisons, sans limite dans le temps";
    if (town.livingConditions.water.continuousAccess !== null) {
        town.livingConditions.water.continuousAccess
            ? result.water.positive.push({ text: wordingWaterContinuousAccess })
            : result.water.negative.push({
                  text:
                      "Accès non continu, c’est-à-dire qu’il varie en qualité et quantité dans la journée et les saisons, sans limite dans le temps"
              });
    } else {
        result.water.unknown.push({ text: wordingWaterContinuousAccess });
    }

    // Point d'eau public
    if (town.livingConditions.water.publicPoint !== null) {
        town.livingConditions.water.publicPoint
            ? result.water.negative.push({ text: "Point d'eau public" })
            : result.water.positive.push({ text: "Point d'eau public" });
    } else {
        result.water.unknown.push({ text: "Point d'eau public" });
    }

    // Distance du point d'eau
    if (town.livingConditions.water.distance !== null) {
        town.livingConditions.water.distance === "0-20"
            ? result.water.positive.push({
                  text: "Accès situé sur site ou à moins de 20 mètres"
              })
            : result.water.negative.push({
                  text: "Accès situé à plus de 20 mètres"
              });
    } else {
        result.water.unknown.push({ text: "Localisation de l'accès" });
    }

    // Franchissement de rues
    const wordingWaterRoadsToCross =
        "Pas de franchissement de rue ou route pour accéder aux points d’eau";
    if (town.livingConditions.water.roadsToCross !== null) {
        !town.livingConditions.water.roadsToCross
            ? result.water.positive.push({ text: wordingWaterRoadsToCross })
            : result.water.negative.push({
                  text: "Franchissement de rue ou route nécessaire"
              });
    } else {
        result.water.unknown.push({ text: wordingWaterRoadsToCross });
    }

    // Acces pour tous
    const wordingWaterEveryoneHasAccess = "Accès pour tous les habitants";
    if (town.livingConditions.water.everyoneHasAccess !== null) {
        town.livingConditions.water.everyoneHasAccess
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
    if (town.livingConditions.water.stagnantWater !== null) {
        !town.livingConditions.water.stagnantWater
            ? result.water.positive.push({ text: wordingWaterStagnantWater })
            : result.water.negative.push({
                  text: "Eaux stagnantes autour du point de distribution"
              });
    } else {
        result.water.unknown.push({ text: wordingWaterStagnantWater });
    }

    // Présence de bacs de lavage & nombre
    const waterHandWashAccessPopulationRatio =
        town.populationTotal && town.livingConditions.water.handWashAccessNumber
            ? Math.floor(
                  Number(town.populationTotal) /
                      Number(town.livingConditions.water.handWashAccessNumber)
              )
            : null;
    const wordingRatio = waterHandWashAccessPopulationRatio
        ? ` - soit 1 bac de lavage pour ${waterHandWashAccessPopulationRatio} personnes`
        : "";
    const wordingWaterHandWashAccess = `${town.livingConditions.water
        .handWashAccessNumber || "Présence de"} bac${
        town.livingConditions.water.andWashAccessNumber > 1 ? "s" : ""
    } de lavage des mains${wordingRatio}`;
    const infoWaterHandWashAccess =
        "il est conseillé au moins 1 bac de lavage pour 20 personnes";

    if (
        town.livingConditions.water.handWashAccess &&
        waterHandWashAccessPopulationRatio &&
        waterHandWashAccessPopulationRatio < 20
    ) {
        result.water.positive.push({
            text: wordingWaterHandWashAccess,
            info: infoWaterHandWashAccess
        });
    } else if (
        town.livingConditions.water.handWashAccess &&
        waterHandWashAccessPopulationRatio &&
        waterHandWashAccessPopulationRatio > 20
    ) {
        result.water.negative.push({
            text: wordingWaterHandWashAccess,
            info: infoWaterHandWashAccess
        });
    } else if (
        town.livingConditions.water.handWashAccess &&
        !waterHandWashAccessPopulationRatio
    ) {
        result.water.positive.push({
            text: wordingWaterHandWashAccess
        });
    } else if (town.livingConditions.water.handWashAccess === false) {
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
    if (town.livingConditions.sanitary.onSite !== null) {
        town.livingConditions.sanitary.onSite
            ? result.sanitary.positive.push({ text: wordingSanitaryOnSite })
            : result.sanitary.negative.push({
                  text: "Accès aux abords du site"
              });
    } else {
        result.sanitary.unknown.push({ text: wordingSanitaryOnSite });
    }

    // Nombre de toilettes & Ratio
    const sanitaryNumberPopulationRatio = Math.floor(
        Number(town.populationTotal) /
            Number(town.livingConditions.sanitary.number)
    );
    const wordingSanitaryRatio = town.livingConditions.sanitary.number
        ? ` - soit 1 toilette pour ${sanitaryNumberPopulationRatio} personnes`
        : "";
    const wordingSanitaryNumber = `${town.livingConditions.sanitary.number ||
        "Présence de"} toilette${
        town.livingConditions.sanitary.number > 1 ? "s" : ""
    }${wordingSanitaryRatio}`;
    const infoSanitaryNumber =
        "il est conseillé au moins 1 toilette pour 20 personnes";

    if (
        town.livingConditions.sanitary.number &&
        sanitaryNumberPopulationRatio < 20
    ) {
        result.sanitary.positive.push({
            text: wordingSanitaryNumber,
            info: infoSanitaryNumber
        });
    } else if (
        town.livingConditions.sanitary.number &&
        sanitaryNumberPopulationRatio > 20
    ) {
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
    if (town.livingConditions.sanitary.insalubrious !== null) {
        !town.livingConditions.sanitary.insalubrious
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
        Number(town.populationTotal) /
            Number(town.livingConditions.trash.cansOnSite)
    );
    if (town.livingConditions.trash.cansOnSite !== null) {
        result.trash.positive.push({
            text: `${town.livingConditions.trash.cansOnSite} poubelle${
                town.livingConditions.trash.cansOnSite > 1 ? "s" : ""
            } / benne${
                town.livingConditions.trash.cansOnSite > 1 ? "s" : ""
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
    if (town.livingConditions.trash.evacuationRegular !== null) {
        town.livingConditions.trash.evacuationRegular
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
    if (town.livingConditions.trash.accumulation !== null) {
        !town.livingConditions.trash.accumulation
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
    if (town.livingConditions.firePrevention.diagnostic !== null) {
        town.livingConditions.firePrevention.diagnostic
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
    if (town.livingConditions.firePrevention.devices !== null) {
        town.livingConditions.firePrevention.devices
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
    if (town.livingConditions.firePrevention.siteAccessible !== null) {
        town.livingConditions.firePrevention.siteAccessible
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
