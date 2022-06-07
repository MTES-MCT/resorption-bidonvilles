const LABELS = {
    water: {
        continuousAccess(status) {
            if (status === "negative") {
                return {
                    text:
                        "Accès non continu, c’est-à-dire qu’il varie en qualité et quantité dans la journée et les saisons, sans limite dans le temps"
                };
            }

            return {
                text:
                    "Accès continu, c’est-à-dire qu’il ne varie pas en qualité et quantité dans la journée et les saisons, sans limite dans le temps"
            };
        },
        distance(status) {
            if (status === "unkown") {
                return {
                    text: "Localisation de l'accès"
                };
            }

            if (status === "negative") {
                return {
                    text: "Accès situé à plus de 20 mètres"
                };
            }

            return {
                text: "Accès situé sur site ou à moins de 20 mètres"
            };
        },
        everyoneHasAccess(status) {
            if (status === "negative") {
                return {
                    text: "Il y a des inégalités d'accès entre les habitants"
                };
            }

            return {
                text: "Pas d'inégalité d'accès entre les habitants"
            };
        },
        handWashAccess(status, town) {
            const info =
                "il est conseillé au moins 1 bac de lavage pour 20 personnes";

            const { handWashAccessNumber } = town.livingConditions.water;
            if (
                Number.isInteger(handWashAccessNumber) &&
                handWashAccessNumber > 0
            ) {
                let text = `${handWashAccessNumber} bac${
                    handWashAccessNumber > 1 ? "s" : ""
                } de lavage des mains`;

                if (Number.isInteger(town.populationTotal)) {
                    const ratio = Math.floor(
                        town.populationTotal / handWashAccessNumber
                    );

                    text += ` - soit 1 bac de lavage pour ${ratio} personnes`;
                }

                return {
                    text,
                    info
                };
            }

            return {
                text: "Présence de bacs de lavage des mains",
                info
            };
        },
        potable(status) {
            if (status === "negative") {
                return {
                    text: "Eau non potable"
                };
            }

            return {
                text: "Eau potable"
            };
        },
        publicPoint() {
            return {
                text: "Point d'eau public"
            };
        },
        roadsToCross(status) {
            if (status === "negative") {
                return {
                    text: "Franchissement de rue ou route nécessaire"
                };
            }

            return {
                text:
                    "Pas de franchissement de rue ou route pour accéder aux points d’eau"
            };
        },
        stagnantWater(status) {
            if (status === "negative") {
                return {
                    text: "Eaux stagnantes autour du point de distribution"
                };
            }

            return {
                text: "Pas d’eaux stagnantes autour du point de distribution"
            };
        }
    },
    sanitary: {
        insalubrious(status) {
            if (status === "negative") {
                return {
                    text: "Marques de défecation à l’air libre"
                };
            }

            return {
                text: "Pas de marques de défécation à l’air libre"
            };
        },
        number(status, town) {
            const info =
                "il est conseillé au moins 1 toilette pour 20 personnes";

            const { number } = town.livingConditions.sanitary;
            if (Number.isInteger(number) && number > 0) {
                let text = `${number} toilette${number > 1 ? "s" : ""}`;

                if (Number.isInteger(town.populationTotal)) {
                    const ratio = Math.floor(town.populationTotal / number);

                    text += ` - soit 1 toilette pour ${ratio} personnes`;
                }

                return {
                    text,
                    info
                };
            }

            return {
                text: "Présence de toilettes",
                info
            };
        },
        onSite(status) {
            if (status === "negative") {
                return {
                    text: "Accès aux abords du site"
                };
            }

            return {
                text: "Accès sur site"
            };
        }
    },
    trash: {
        cansOnSite(status, town) {
            const { cansOnSite } = town.livingConditions.trash;
            if (Number.isInteger(cansOnSite) && cansOnSite > 0) {
                let text = `${cansOnSite} poubelle${
                    cansOnSite > 1 ? "s" : ""
                } / benne${
                    cansOnSite > 1 ? "s" : ""
                } sont à proximité immédiate du site (moins de 100 mètres)`;

                if (Number.isInteger(town.populationTotal)) {
                    const ratio = Math.floor(town.populationTotal / cansOnSite);

                    text += ` - soit 1 pour ${ratio} personnes`;
                }

                return {
                    text
                };
            }

            return {
                text:
                    "Nombre de poubelles / bennes à proximité immédiate du site (moins de 100 mètres)"
            };
        },
        evacuationRegular(status) {
            if (status === "negative") {
                return {
                    text: "Pas de collecte régulière des poubelles / bennes"
                };
            }

            return {
                text:
                    "Collecte régulière des poubelles / bennes. C’est-à-dire au moins une fois par semaine, à partir d’un point de dépôt spécialement aménagé sur le site ou à proximité immédiate"
            };
        },
        accumulation(status) {
            if (status === "negative") {
                return {
                    text: "Accumulation de déchets sur le site ou aux abords"
                };
            }

            return {
                text: "Pas d’accumulation de déchets sur le site ou aux abords"
            };
        }
    },
    firePrevention: {
        diagnostic(status) {
            if (status === "negative") {
                return {
                    text:
                        "Pas de diagnostic prévention incendie réalisé par le SDIS"
                };
            }

            return {
                text: "Diagnostic prévention incendie par le SDIS réalisé"
            };
        },
        devices(status) {
            if (status === "negative") {
                return {
                    text:
                        "Pas de mesure spécifiques (formation, extincteurs...) en place"
                };
            }

            return {
                text: "Mesures spécifiques en place"
            };
        },
        siteAccessible(status) {
            if (status === "negative") {
                return {
                    text: "Site pas accessible aux pompiers"
                };
            }

            return {
                text: "Site accessible aux pompiers"
            };
        }
    }
};

// new properties
LABELS.water.accessIsPublic = status => {
    if (status === "negative") {
        return {
            text: "Le point d'accès est sur la voie publique"
        };
    }

    if (status === "negative") {
        return {
            text: "Le point d'accès est-il sur la voie publique ?"
        };
    }

    return {
        text: "Le point d'accès n'est pas sur la voie publique"
    };
};
LABELS.water.accessIsContinuous = LABELS.water.continuousAccess;
LABELS.water.accessIsLocal = status => {
    if (status === "negative") {
        return {
            text: "Le point d'accès est à l'extérieur du site"
        };
    }

    if (status === "unknown") {
        return {
            text: "Localisation du point d'accès (sur site ou extérieur)"
        };
    }

    return {
        text: "Le point d'accès est sur le site"
    };
};
LABELS.water.accessIsClose = status => {
    if (status === "unkown") {
        return {
            text: "Distance point d’eau / habitation la plus éloignée"
        };
    }

    if (status === "negative") {
        return {
            text:
                "La plus grande distance point d'eau / habitation est de plus de 200 mètres"
        };
    }

    return {
        text:
            "La plus grande distance point d'eau / habitation est de moins de 200 mètres"
    };
};
LABELS.water.accessIsUnequal = LABELS.water.everyoneHasAccess;
LABELS.water.accessHasStagnantWater = LABELS.water.stagnantWater;

LABELS.sanitary.openAirDefecation = LABELS.sanitary.insalubrious;
LABELS.sanitary.toiletTypes = status => {
    if (status === "negative") {
        return {
            text: "Latrines uniquement"
        };
    }

    if (status === "positive") {
        return {
            text: "Présence de toilettes fonctionnelles"
        };
    }

    return {
        text: "Types de toilettes"
    };
};
LABELS.sanitary.toiletsAreInside = status => {
    if (status === "negative") {
        return {
            text: "Pas de toilettes à l'intérieur du site"
        };
    }

    return {
        text: "Toilettes à l'intérieur du site"
    };
};
LABELS.sanitary.toiletsAreLighted = status => {
    if (status === "negative") {
        return {
            text: "Toilettes non éclairées et/ou verrouillables de l'intérieur"
        };
    }

    return {
        text: "Toilettes éclairées et verrouillables de l'intérieur"
    };
};
LABELS.sanitary.handWashing = status => {
    if (status === "negative") {
        return {
            text: "Pas de point de lavage des mains à proximité des toilettes"
        };
    }

    return {
        text: "Présence de points de lavage des mains à proximité des toilettes"
    };
};

LABELS.electricity = {
    accessTypes() {
        return {
            text: "Source d'accès"
        };
    },
    accessIsUnequal() {
        return {
            text: "Inégalité d'accès à l'électricité"
        };
    }
};

LABELS.trash.isPiling = LABELS.trash.accumulation;
LABELS.trash.evacuationIsRegular = LABELS.trash.evacuationRegular;
LABELS.trash.evacuationIsSafe = status => {
    if (status === "negative") {
        return {
            text:
                "Les dispositifs de ramassage des ordures ménagères ne sont pas en bon état / sécurisés"
        };
    }

    if (status === "unknown") {
        return {
            text: "État des dispositifs de ramassage des ordures ménagères"
        };
    }

    return {
        text:
            "Les dispositifs de ramassage des ordures ménagères sont en bon état et sécurisés"
    };
};
LABELS.trash.bulkyIsPiling = status => {
    if (status === "positive") {
        return {
            text:
                "Pas d'accumulation de déchets type encombrants (hors ferraille) / gravats"
        };
    }

    return {
        text:
            "Accumulation de déchets type encombrants (hors ferraille) / gravats"
    };
};

export default function getLabelForLivingConditionDetail(
    conditionKey,
    key,
    status,
    town
) {
    const label = LABELS[conditionKey] && LABELS[conditionKey][key];
    if (label) {
        return label(status, town);
    }

    return {
        text: "inconnu"
    };
}
