import { AuthUser } from '#server/middlewares/authMiddleware';
import organizationModel from '#server/models/organizationModel';
import { ShantytownExportListProperty } from '#server/services/shantytown/_common/serializeExportProperties';
import { ClosingSolution } from '#root/types/resources/ClosingSolution.d';

export type ShantytownExportListOption = 'address_details' | 'owner' | 'living_conditions' | 'demographics' | 'justice' | 'actors' | 'comments';
type ShantytownExportSection = {
    title: string,
    properties?: ShantytownExportListProperty[],
    lastFrozen?: boolean,
    subsections?: ShantytownExportSection[],
};

export default async (
    user: AuthUser,
    options: ShantytownExportListOption[],
    properties: { [key: string]: ShantytownExportListProperty },
    closedTowns: boolean,
    closingSolutions: ClosingSolution[],
): Promise<ShantytownExportSection[]> => {
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
        lastFrozen: true,
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
            properties.resorptionTarget,
        ],
    };

    if (closedTowns) {
        section.properties.push(properties.closedAt);
        section.properties.push(properties.closedWithSolutions);
        section.properties.push(properties.status);
        section.properties.push(properties.closingContext);
    }

    if (options.indexOf('owner') !== -1 && user.isAllowedTo('access', 'shantytown_owner')) {
        section.properties.push(properties.ownerType);
        section.properties.push(properties.owner);
    }


    sections.push(section);

    sections.push({
        title: 'Habitants',
        properties: [
            properties.populationTotal,
            properties.populationCouples,
            properties.populationMinors,
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
                properties.policeStatus,
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
        title: null,
        properties: [
            properties.updatedAt,
        ],
    });

    return sections;
};
