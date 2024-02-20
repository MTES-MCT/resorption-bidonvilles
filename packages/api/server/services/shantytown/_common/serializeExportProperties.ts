import dateUtils from '#server/utils/date';
import userModel from '#server/models/userModel';
import shantytownActorThemes from '#server/config/shantytown_actor_themes';
import config from '#server/config';
import electricityAccessTypes from '#server/models/electricityAccessTypesModel/_common/electricityAccessTypes';
import waterAccessTypes from '#server/models/_common/waterAccessTypes';
import toiletTypes from '#server/models/shantytownToiletTypesModel/_common/toiletTypes';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import electricityAccessStatusLabels from './livingConditionsStatusLabels/electricityAccessStatusLabels';
import waterAccessStatusLabels from './livingConditionsStatusLabels/waterAccessStatusLabels';
import sanitaryAccessStatusLabels from './livingConditionsStatusLabels/sanitaryAccessStatusLabels';
import trashEvacuationStatusLabels from './livingConditionsStatusLabels/trashEvacuationStatusLabels';
import pestAnimalsStatusLabels from './livingConditionsStatusLabels/pestAnimalsStatusLabels';
import firePreventionStatusLabels from './livingConditionsStatusLabels/firePreventionStatusLabels';
import { ClosingSolution } from '#root/types/resources/ClosingSolution.d';

const { fromTsToFormat: tsToString } = dateUtils;
const { webappUrl } = config;

export type ShantytownExportListProperty = {
    title: string,
    data: (shantytown: Shantytown) => string | number | Date | null,
    width: number,
    align?: 'left' | 'center' | 'right',
    bold?: boolean,
    sum?: boolean,
    link?: (shantytown: Shantytown) => string,
};

export default (closingSolutions: ClosingSolution[]) => {
    const COLUMN_WIDTHS = {
        XSMALL: 15,
        SMALL: 20,
        MEDIUM: 25,
        LARGE: 35,
    };

    const STATUS_DETAILS = {
        resorbed: 'Résorption progressive du site',
        closed_by_justice: 'Décision de justice suite à une plainte du propriétaire',
        closed_by_pref_admin: 'Décision administrative de la Préfecture',
        closed_by_city_admin: 'Décision administrative de la Commune',
        other: 'Autre',
        unknown: 'Raison inconnue',
    };

    const properties: { [key: string]: ShantytownExportListProperty } = {
        departement: {
            title: 'Département',
            data: ({ departement }: Shantytown) => `${departement.code} - ${departement.name}`,
            align: 'left',
            width: COLUMN_WIDTHS.LARGE,
        },
        city: {
            title: 'Commune',
            data: ({ city }: Shantytown) => city.name,
            bold: true,
            align: 'left',
            width: COLUMN_WIDTHS.MEDIUM,
        },
        citycode: {
            title: 'Code INSEE',
            data: ({ city }: Shantytown) => city.code,
            bold: true,
            align: 'left',
            width: COLUMN_WIDTHS.SMALL,
        },
        epci: {
            title: 'EPCI',
            data: ({ epci }: Shantytown) => epci.name,
            bold: true,
            align: 'left',
            width: COLUMN_WIDTHS.MEDIUM,
        },
        address: {
            title: 'Adresse',
            data: ({ addressSimple }: Shantytown) => addressSimple,
            link({ id }) {
                return `${webappUrl}/site/${id}`;
            },
            bold: true,
            align: 'left',
            width: COLUMN_WIDTHS.MEDIUM,
        },
        addressDetails: {
            title: 'Informations d\'accès',
            data: ({ addressDetails }: Shantytown) => addressDetails,
            width: COLUMN_WIDTHS.LARGE,
        },
        latitude: {
            title: 'Latitude',
            data: ({ latitude }: Shantytown) => `${latitude}`,
            width: COLUMN_WIDTHS.SMALL,
        },
        longitude: {
            title: 'Longitude',
            data: ({ longitude }: Shantytown) => `${longitude}`,
            width: COLUMN_WIDTHS.SMALL,
        },
        name: {
            title: 'Appellation du site',
            data: ({ name }: Shantytown) => name,
            width: COLUMN_WIDTHS.LARGE,
        },
        fieldType: {
            title: 'Type de site',
            data: ({ fieldType }: Shantytown) => fieldType.label,
            width: COLUMN_WIDTHS.SMALL,
        },
        builtAt: {
            title: 'Date d\'installation',
            data: ({ builtAt }: Shantytown) => (builtAt ? new Date(builtAt * 1000) : ''),
            width: COLUMN_WIDTHS.SMALL,
        },
        declaredAt: {
            title: 'Date de signalement',
            data: ({ declaredAt }: Shantytown) => (declaredAt ? new Date(declaredAt * 1000) : ''),
            width: COLUMN_WIDTHS.SMALL,
        },
        closedAt: {
            title: 'Date de fermeture',
            data: ({ closedAt }: Shantytown) => (closedAt ? new Date(closedAt * 1000) : ''),
            width: COLUMN_WIDTHS.SMALL,
        },
        closedWithSolutions: {
            title: 'Résorbé',
            data: ({ closedWithSolutions }: Shantytown) => (closedWithSolutions === 'yes' ? 'Oui' : 'Non'),
            width: COLUMN_WIDTHS.XSMALL,
        },
        status: {
            title: 'Cause de la fermeture',
            data: ({ status }: Shantytown) => STATUS_DETAILS[status],
            width: COLUMN_WIDTHS.SMALL,
        },
        closingContext: {
            title: 'Contexte de la fermeture',
            data: ({ closingContext }: Shantytown) => closingContext,
            width: COLUMN_WIDTHS.SMALL,
        },
        ownerType: {
            title: 'Type de propriétaire',
            data: ({ ownerType }: Shantytown) => ownerType.label,
            width: COLUMN_WIDTHS.SMALL,
        },
        owner: {
            title: 'Identité du propriétaire',
            data: (shantytown: Shantytown) => ('owner' in shantytown ? shantytown.owner : null),
            width: COLUMN_WIDTHS.MEDIUM,
        },
        isReinstallation: {
            title: 'S\'agit-il d\'une réinstallation ?',
            data: ({ isReinstallation }: Shantytown) => {
                if (isReinstallation === true) {
                    return 'oui';
                }

                if (isReinstallation === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        reinstallationComments: {
            title: 'Précisions sur la réinstallation',
            data: ({ reinstallationComments }: Shantytown) => reinstallationComments,
            width: COLUMN_WIDTHS.LARGE,
        },
        populationTotal: {
            title: 'Nombre de personnes',
            data: ({ populationTotal }: Shantytown) => populationTotal,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        populationCouples: {
            title: 'Nombre de ménages',
            data: ({ populationCouples }: Shantytown) => populationCouples,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        populationMinors: {
            title: 'Nombre de mineurs',
            data: ({ populationMinors }: Shantytown) => populationMinors,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        populationMinors0To3: {
            title: '0 à 3 ans',
            data: ({ populationMinors0To3 }: Shantytown) => populationMinors0To3,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        populationMinors3To6: {
            title: '3 à 6 ans',
            data: ({ populationMinors3To6 }: Shantytown) => populationMinors3To6,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        populationMinors6To12: {
            title: '6 à 12 ans',
            data: ({ populationMinors6To12 }: Shantytown) => populationMinors6To12,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        populationMinors12To16: {
            title: '12 à 16 ans',
            data: ({ populationMinors12To16 }: Shantytown) => populationMinors12To16,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        populationMinors16To18: {
            title: '16 à 18 ans',
            data: ({ populationMinors16To18 }: Shantytown) => populationMinors16To18,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        minorsInSchool: {
            title: 'Enfants inscrits dans un établissement scolaire',
            data: ({ minorsInSchool }: Shantytown) => minorsInSchool,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        caravans: {
            title: 'Nombre de caravanes',
            data: ({ caravans }: Shantytown) => caravans,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        huts: {
            title: 'Nombre de cabanes',
            data: ({ huts }: Shantytown) => huts,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        tents: {
            title: 'Nombre de tentes',
            data: ({ tents }: Shantytown) => tents,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        cars: {
            title: 'Nombre de voitures dortoir',
            data: ({ cars }: Shantytown) => cars,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        mattresses: {
            title: 'Nombre de matelas',
            data: ({ mattresses }: Shantytown) => mattresses,
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        },
        socialOrigins: {
            title: 'Origines',
            data: ({ socialOrigins }: Shantytown) => (socialOrigins.length > 0 ? socialOrigins.map(({ label }) => label).join(';') : null),
            width: COLUMN_WIDTHS.MEDIUM,
        },
        heatwaveStatus: {
            title: 'Alerte Canicule',
            data: ({ heatwaveStatus }: Shantytown) => {
                if (heatwaveStatus === true) {
                    return 'oui';
                }

                if (heatwaveStatus === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        electricityAccessStatus: {
            title: "Statut de l'accès à l'électricité",
            data: (shantytown: Shantytown) => {
                const data = electricityAccessStatusLabels[shantytown.livingConditions.electricity.status.status] || 'inconnu';
                return data;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },

        electricityAccess: {
            title: 'Y a-t-il présence d’une installation électrique ?',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.electricity.access;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        electricityAccessTypes: {
            title: "Quelle est la source de l'accès à l'électricité ?",
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.electricity.access_types;
                if (!data || data.length === 0) {
                    return null;
                }

                return data.map(at => electricityAccessTypes[at]).join('\n');
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        electricityAccessIsUnequal: {
            title: "Des inégalités d’accès à l'électricité ont-elles été constatées ?",
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.electricity.access_is_unequal;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessStatus: {
            title: "Statut de l'accès à l'eau",
            data: (shantytown: Shantytown) => {
                const data = waterAccessStatusLabels[shantytown.livingConditions.water.status.status] || 'inconnu';
                return data;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessType: {
            title: "Comment les habitants ont-ils accès à l'eau ?",
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.water.access_type;
                if (!data) {
                    return null;
                }

                return waterAccessTypes[data];
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessTypeDetails: {
            title: "Précisions concernant les modalités d'accès à l'eau",
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                return shantytown.livingConditions.water.access_type_details;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessIsPublic: {
            title: 'Est-ce un point d\'eau sur la voie publique ?',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.water.access_is_public;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessIsContinuous: {
            title: "L'accès à l'eau est-il continu ?",
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.water.access_is_continuous;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessIsContinuousDetails: {
            title: "Précisions concernant la discontinuité de l'accès à l'eau",
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                return shantytown.livingConditions.water.access_is_continuous_details;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessIsLocal: {
            title: "Accès à l'eau sur site ?",
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.water.access_is_local;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessIsClose: {
            title: 'Distance point d’eau / habitation la plus éloignée ?',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.water.access_is_close;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessIsUnequal: {
            title: 'Des inégalités d\'accès à l\'eau ont-elles été constatées ?',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.water.access_is_unequal;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessIsUnequalDetails: {
            title: 'Précisions concernant les inégalités d\'accès à l\'eau',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                return shantytown.livingConditions.water.access_is_unequal_details;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessHasStagnantWater: {
            title: 'Existe-t-il des eaux stagnantes autour du point de distribution ?',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.water.access_has_stagnant_water;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        waterAccessComments: {
            title: 'Informations complémentaires sur l\'accès à l\'eau',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                return shantytown.livingConditions.water.access_comments;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        sanitaryAccessStatus: {
            title: 'Statut de l\'accès aux sanitaires',
            data: (shantytown: Shantytown) => {
                const data = sanitaryAccessStatusLabels[shantytown.livingConditions.sanitary.status.status] || 'inconnu';
                return data;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        sanitaryOpenAirDefecation: {
            title: 'Constate-t-on des marques de défécation à l’air libre ?',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.sanitary.open_air_defecation;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        sanitaryWorkingToilets: {
            title: 'Présence de toilettes fonctionnelles ?',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.sanitary.working_toilets;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        sanitaryToiletTypes: {
            title: 'Quels sont les types de toilettes installées ?',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.sanitary.toilet_types;
                if (!data || data.length === 0) {
                    return null;
                }

                return data.map(tt => toiletTypes[tt]).join('\n');
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        sanitaryToiletsAreInside: {
            title: 'Les toilettes sont-elles à l’intérieur du site ?',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.sanitary.toilets_are_inside;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        sanitaryToiletsAreLighted: {
            title: 'Ces toilettes sont-elles éclairées et verrouillables de l’intérieur ?',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.sanitary.toilets_are_lighted;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        sanitaryHandWashing: {
            title: 'Y a-t-il un point de lavage des mains à proximité des toilettes ?',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.sanitary.hand_washing;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        trashEvacuationStatus: {
            title: 'Statut de l\'évacuation des déchets',
            data: (shantytown: Shantytown) => {
                const data = trashEvacuationStatusLabels[shantytown.livingConditions.trash.status.status] || 'inconnu';
                return data;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        trashIsPiling: {
            title: 'Constate-t-on une accumulation de déchets type ordures ménagères sur le site ou aux abords ?',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.trash.is_piling;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        trashEvacuationIsClose: {
            title: 'Y a-t-il des dispositifs de ramassage des ordures ménagères à proximité immédiate ?',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.trash.evacuation_is_close;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        trashEvacuationIsSafe: {
            title: 'Les dispositifs de ramassages des ordures sont-ils en bon état ?',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.trash.evacuation_is_safe;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        trashEvacuationIsRegular: {
            title: 'La collecte des poubelles est-elle réalisée de manière régulière ?',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.trash.evacuation_is_regular;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        trashBulkyIsPiling: {
            title: 'Constate-t-on une accumulation de déchets type encombrants ?',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                const data = shantytown.livingConditions.trash.bulky_is_piling;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        pestAnimalsStatus: {
            title: 'Statut de la présence de nuisibles',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return 'inconnu';
                }

                const data = pestAnimalsStatusLabels[shantytown.livingConditions.pest_animals.status.status] || 'inconnu';
                return data;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        pestAnimalsPresence: {
            title: 'Y a-t-il des nuisibles à proximité ?',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                if (!shantytown.livingConditions.pest_animals) {
                    return null;
                }

                const data = shantytown.livingConditions.pest_animals.presence;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        pestAnimalsDetails: {
            title: 'Précision concernant les nuisibles',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                return shantytown.livingConditions.pest_animals.details;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        firePreventionStatus: {
            title: 'Statut du diagnostic prévention incendie',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return 'inconnu';
                }

                const data = firePreventionStatusLabels[shantytown.livingConditions.fire_prevention.status.status] || 'inconnu';
                return data;
            },
            width: COLUMN_WIDTHS.MEDIUM,

        },
        firePreventionDiagnostic: {
            title: 'Est-ce qu’un diagnostic prévention incendie par le SDIS a été réalisé ?',
            data: (shantytown: Shantytown) => {
                if (shantytown.livingConditions.version !== 2) {
                    return null;
                }

                if (!shantytown.livingConditions.fire_prevention) {
                    return null;
                }

                const data = shantytown.livingConditions.fire_prevention.diagnostic;
                if (data === true) {
                    return 'oui';
                }

                if (data === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        censusStatus: {
            title: 'Statut du diagnostic social',
            data: ({ censusStatus }: Shantytown) => {
                switch (censusStatus) {
                    case null: return 'Inconnu';
                    case 'none': return 'Non prévu';
                    case 'scheduled': return 'Prévu';
                    case 'done': return 'Réalisé';
                    default: return null;
                }
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        censusConductedAt: {
            title: 'Date du diagnostic',
            data: ({ censusConductedAt }: Shantytown) => tsToString(censusConductedAt, 'd/m/Y'),
            width: COLUMN_WIDTHS.SMALL,
        },
        censusConductedBy: {
            title: 'Service en charge du diagnostic',
            data: ({ censusConductedBy }: Shantytown) => censusConductedBy,
            width: COLUMN_WIDTHS.SMALL,
        },
        ownerComplaint: {
            title: 'Dépôt de plainte par le propriétaire',
            data: (shantytown: Shantytown) => {
                if (!('ownerComplaint' in shantytown)) {
                    return null;
                }

                if (shantytown.ownerComplaint === true) {
                    return 'oui';
                }

                if (shantytown.ownerComplaint === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        justiceProcedure: {
            title: 'Existence d\'une procédure judiciaire',
            data: (shantytown: Shantytown) => {
                if (!('justiceProcedure' in shantytown)) {
                    return null;
                }

                if (shantytown.justiceProcedure === true) {
                    return 'oui';
                }

                if (shantytown.justiceProcedure === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        justiceRendered: {
            title: 'Décision de justice rendue',
            data: (shantytown: Shantytown) => {
                if (!('justiceRendered' in shantytown)) {
                    return null;
                }

                if (shantytown.justiceRendered === true) {
                    return 'oui';
                }

                if (shantytown.justiceRendered === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        justiceRenderedAt: {
            title: 'Date de la décision',
            data: (shantytown: Shantytown) => {
                if (!('justiceRenderedAt' in shantytown)) {
                    return null;
                }

                return (shantytown.justiceRenderedAt ? new Date(shantytown.justiceRenderedAt * 1000) : '');
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        justiceRenderedBy: {
            title: 'Origine de la décision',
            data: (shantytown: Shantytown) => {
                if (!('justiceRenderedBy' in shantytown)) {
                    return null;
                }

                return shantytown.justiceRenderedBy;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        justiceChallenged: {
            title: 'Contentieux',
            data: (shantytown: Shantytown) => {
                if (!('justiceChallenged' in shantytown)) {
                    return null;
                }

                if (shantytown.justiceChallenged === true) {
                    return 'oui';
                }

                if (shantytown.justiceChallenged === false) {
                    return 'non';
                }

                return null;
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        policeStatus: {
            title: 'Concours de la force publique',
            data: (shantytown: Shantytown) => {
                if (!('policeStatus' in shantytown)) {
                    return null;
                }

                switch (shantytown.policeStatus) {
                    case null: return 'Inconnu';
                    case 'none': return 'Non demandé';
                    case 'requested': return 'Demandé';
                    case 'granted': return 'Obtenu';
                    default: return null;
                }
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        policeRequestedAt: {
            title: 'Date de la demande du CFP',
            data: (shantytown: Shantytown) => {
                if (!('policeRequestedAt' in shantytown)) {
                    return null;
                }

                return (shantytown.policeRequestedAt ? new Date(shantytown.policeRequestedAt * 1000) : '');
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        policeGrantedAt: {
            title: 'Date d\'octroi du CFP',
            data: (shantytown: Shantytown) => {
                if (!('policeGrantedAt' in shantytown)) {
                    return null;
                }

                return (shantytown.policeGrantedAt ? new Date(shantytown.policeGrantedAt * 1000) : '');
            },
            width: COLUMN_WIDTHS.SMALL,
        },
        bailiff: {
            title: 'Nom de l\'étude d\'huissiers',
            data: (shantytown: Shantytown) => {
                if (!('bailiff' in shantytown)) {
                    return null;
                }

                return shantytown.bailiff;
            },
            width: COLUMN_WIDTHS.MEDIUM,
        },
        updatedAt: {
            title: 'Site mis à jour le',
            data: ({ updatedAt }: Shantytown) => (updatedAt ? tsToString(updatedAt, 'd/m/Y') : ''),
            width: COLUMN_WIDTHS.SMALL,
        },
        actors: {
            title: 'Intervenants (à la date de l\'export)',
            data: ({ actors }: Shantytown) => actors.map((actor) => {
                const name = `${userModel.formatName(actor)}, ${actor.organization.name}`;
                const themes = actor.themes.map(theme => ('value' in theme ? theme.value : shantytownActorThemes[theme.id])).join(', ');

                return `- ${name} (${themes})`;
            }).join('\n'),
            width: COLUMN_WIDTHS.LARGE,
        },
        comments: {
            title: 'Commentaires',
            data: ({ comments }: Shantytown) => comments.slice(0, 5).map(comment => `${tsToString(comment.createdAt, 'd/m/Y à h:i')} - ${userModel.formatName(comment.createdBy)}\n${comment.description}`).join('\n----\n'),
            width: COLUMN_WIDTHS.LARGE,
        },
        last_comment_date: {
            title: 'Date du dernier message',
            data: ({ comments }: Shantytown) => {
                if (comments.length === 0) {
                    return '';
                }

                return tsToString(comments[0].createdAt, 'd/m/Y');
            },
            width: COLUMN_WIDTHS.LARGE,
        },


        hasAction: {
            title: 'Le site fait-il l’objet d’une action ?',
            data: ({ actions }: Shantytown) => (actions.length > 0 ? 'oui' : 'non'),
            width: COLUMN_WIDTHS.SMALL,
        },

        resorptionTarget: {
            title: 'Site avec objectif de résorption ?',
            data: ({ resorptionTarget }: Shantytown) => {
                if (resorptionTarget === null) {
                    return null;
                }

                return resorptionTarget;
            },
            width: COLUMN_WIDTHS.SMALL,
        },

    };

    closingSolutions.forEach(({ id: solutionId }) => {
        properties[`closingSolution${solutionId}_population`] = {
            title: 'Nombre de personnes',
            data: ({ closingSolutions: solutions }: Shantytown) => {
                const solution = solutions.find(({ id }) => id === solutionId);
                if (solution === undefined) {
                    return '';
                }

                return solution.peopleAffected;
            },
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        };
        properties[`closingSolution${solutionId}_households`] = {
            title: 'Nombre de ménages',
            data: ({ closingSolutions: solutions }: Shantytown) => {
                const solution = solutions.find(({ id }) => id === solutionId);
                if (solution === undefined) {
                    return '';
                }

                return solution.householdsAffected;
            },
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        };
        properties[`closingSolution${solutionId}_message`] = {
            title: 'Message',
            data: ({ closingSolutions: solutions }: Shantytown) => {
                const solution = solutions.find(({ id }) => id === solutionId);
                if (solution === undefined) {
                    return '';
                }

                return solution.message;
            },
            width: COLUMN_WIDTHS.SMALL,
            sum: true,
        };
    });
    return properties;
};
