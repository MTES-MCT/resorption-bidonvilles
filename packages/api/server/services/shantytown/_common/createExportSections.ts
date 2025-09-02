import { AuthUser } from '#server/middlewares/authMiddleware';
import organizationModel from '#server/models/organizationModel';
import { ShantytownExportListOption, ShantytownExportListProperty, ShantytownExportSection } from '#root/types/resources/ShantytownExportTypes.d';
import { ClosingSolution } from '#root/types/resources/ClosingSolution.d';
import { ExportedSitesStatus } from '#root/types/resources/exportedSitesStatus.d';

function isClosedTowns(exportedSitesStatus: ExportedSitesStatus): boolean {
    return exportedSitesStatus !== 'open' && exportedSitesStatus !== 'inProgress';
}

export default async (
    user: AuthUser,
    options: ShantytownExportListOption[],
    properties: { [key: string]: ShantytownExportListProperty },
    exportedSitesStatus: ExportedSitesStatus,
    closingSolutions: ClosingSolution[],
): Promise<ShantytownExportSection[]> => {
    const closedTowns = isClosedTowns(exportedSitesStatus);
    const sections: ShantytownExportSection[] = [];

    const localizationSection: ShantytownExportSection = {
        title: 'Localisation',
        properties: [
            properties.departement,
            properties.city,
            properties.citycode,
            properties.epci,
            properties.address,
            properties.name,
        ],
    };
    sections.push(localizationSection);

    if (options.indexOf('address_details') !== -1 && !closedTowns) {
        localizationSection.properties.push(properties.addressDetails);
    }

    localizationSection.properties.push(properties.latitude);
    localizationSection.properties.push(properties.longitude);


    let section = {
        title: 'Site',
        properties: [
            properties.fieldType,
            properties.builtAt,
            properties.declaredAt,
            properties.isReinstallation,
            properties.reinstallationComments,
            properties.hasAction,
            properties.hasAtLeastOneActionFinanced,
            user.isAllowedTo('read', 'action') ? properties.resorptionTarget : undefined,
        ],
    };

    if (closedTowns) {
        section.properties.push(properties.closedAt);
        section.properties.push(properties.closedWithSolutions);
        section.properties.push(properties.status);
        section.properties.push(properties.closingContext);
    }

    if (options.indexOf('owner') !== -1 && user.isAllowedTo('access', 'shantytown_owner')) {
        // Ajout des propriétés liées aux propriétaires
        section.properties.push(properties.owner);
    }


    sections.push(section);

    sections.push({
        title: 'Habitants',
        properties: [
            properties.populationTotal,
            properties.populationTotalFemales,
            properties.populationCouples,
            properties.populationMinors,
            properties.populationMinorsGirls,
            properties.populationMinors0To3,
            properties.populationMinors3To6,
            properties.populationMinors6To12,
            properties.populationMinors12To16,
            properties.populationMinors16To18,
            properties.minorsInSchool,
            properties.caravans,
            properties.huts,
            properties.tents,
            properties.cars,
            properties.mattresses,
            properties.socialOrigins,
        ],
    });

    if (options.indexOf('living_conditions') !== -1) {
        sections.push({
            title: 'Conditions de vie',
            properties: [
                properties.heatwaveStatus,
                properties.electricityAccessStatus,
                properties.electricityAccess,
                properties.electricityAccessTypes,
                properties.electricityAccessIsUnequal,
                properties.waterAccessStatus,
                properties.waterAccessType,
                properties.waterAccessTypeDetails,
                properties.waterAccessIsPublic,
                properties.waterAccessIsContinuous,
                properties.waterAccessIsContinuousDetails,
                properties.waterAccessIsLocal,
                properties.waterAccessIsClose,
                properties.waterAccessIsUnequal,
                properties.waterAccessIsUnequalDetails,
                properties.waterAccessHasStagnantWater,
                properties.waterAccessComments,
                properties.sanitaryAccessStatus,
                properties.sanitaryOpenAirDefecation,
                properties.sanitaryWorkingToilets,
                properties.sanitaryToiletTypes,
                properties.sanitaryToiletsAreInside,
                properties.sanitaryToiletsAreLighted,
                properties.sanitaryHandWashing,
                properties.trashEvacuationStatus,
                properties.trashIsPiling,
                properties.trashEvacuationIsClose,
                properties.trashEvacuationIsSafe,
                properties.trashEvacuationIsRegular,
                properties.trashBulkyIsPiling,
                properties.pestAnimalsStatus,
                properties.pestAnimalsPresence,
                properties.pestAnimalsDetails,
                properties.firePreventionStatus,
                properties.firePreventionDiagnostic,
            ],
        });
    }
    if (options.indexOf('demographics') !== -1) {
        section = {
            title: 'Diagnostic',
            properties: [
                properties.censusConductedAt,
                properties.censusConductedBy,
            ],
        };

        if (!closedTowns) {
            section.properties.unshift(properties.censusStatus);
        }

        sections.push(section);
    }

    if (options.indexOf('justice') !== -1 && user.isAllowedTo('access', 'shantytown_justice')) {
        sections.push({
            title: 'Procédure judiciaire ou administrative',
            properties: [
                properties.ownerComplaint,
                properties.justiceProcedure,
                properties.justiceRendered,
                properties.justiceRenderedAt,
                properties.justiceRenderedBy,
                properties.justiceChallenged,
                properties.evacuationUnderTimeLimit,
                properties.administrativeOrderEvacuationAt,
                properties.administrativeOrderDecisionRenderedBy,
                properties.administrativeOrderDecisionAt,
                properties.insalubrityOrder,
                properties.insalubrityOrderDisplayed,
                properties.insalubrityOrderType,
                properties.insalubrityOrderBy,
                properties.insalubrityOrderAt,
                properties.insalubrityParcels,
                properties.policeStatus,
                properties.policeRequestedAt,
                properties.policeGrantedAt,
                properties.bailiff,
                properties.existingLitigation,
            ],
        });
    }

    if (options.indexOf('actors') !== -1) {
        const allOrganizations = (await organizationModel.findByName(user.organization.name)).map(organization => organization.id);

        sections.push({
            title: 'Intervenants',
            properties: [
                properties.actors,
                {
                    title: 'Intervenant de ma structure',
                    data: ({ actors }) => (actors.some(actor => allOrganizations.includes(actor.organization.id)) ? 'Oui' : 'Non'),
                    width: 20,
                    sum: true,
                },
            ],
        });
    }

    // Section Phases de résorption : uniquement pour les sites "en cours de résorption" ou "résorbés"
    // et si l'utilisateur a la permission d'accès ou est superuser (admin national)
    const isResorptionOrResorbedSites = ['inProgress', 'resorbed'].includes(exportedSitesStatus);
    if (isResorptionOrResorbedSites && (user.is_superuser || user.isAllowedTo('access', 'shantytown_resorption'))) {
        sections.push({
            title: 'Phases de résorption',
            properties: [
                properties.preparatoryPhasesTowardResorption,
            ],
        });
    }

    if (closedTowns === true) {
        const subSections: ShantytownExportSection[] = [];
        closingSolutions.forEach(({ id: solutionId, label }) => {
            subSections.push({
                title: label.split(' (')[0],
                properties: [
                    properties[`closingSolution${solutionId}_population`],
                    properties[`closingSolution${solutionId}_households`],
                    properties[`closingSolution${solutionId}_message`],
                ],
            });
        });

        sections.push({
            title: 'Orientation',
            subsections: subSections,
        });
    }

    const commentProps: ShantytownExportListProperty[] = [];
    if (options.indexOf('comments') !== -1 && user.isAllowedTo('list', 'shantytown_comment')) {
        commentProps.push(properties.comments);
        commentProps.push(properties.last_comment_date);
    }

    if (commentProps.length > 0) {
        sections.push({
            title: 'Commentaires',
            properties: commentProps,
        });
    }

    sections.push({
        title: 'Mise à jour',
        properties: [
            properties.updatedAt,
        ],
    });

    return sections;
};
