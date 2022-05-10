module.exports = (user, data, properties, closedTowns, closingSolutions) => {
    const options = data.options ? data.options.split(',') : [];
    const sections = [];

    const localizationSection = {
        title: 'Localisation',
        properties: [
            properties.departement,
            properties.city,
            properties.citycode,
            properties.address,
            properties.name,
        ],
        lastFrozen: true,
    };
    sections.push(localizationSection);

    if (options.indexOf('address_details') !== -1 && !closedTowns) {
        localizationSection.properties.push(properties.addressDetails);
    }

    localizationSection.properties.push(properties.coordinates);


    let section = {
        title: 'Site',
        properties: [
            properties.fieldType,
            properties.builtAt,
            properties.declaredAt,
            properties.isReinstallation,
            properties.reinstallationComments,
            properties.hasPlan,
            properties.resorptionTarget,
        ],
    };

    if (closedTowns) {
        section.properties.push(properties.closedAt);
        section.properties.push(properties.closedWithSolutions);
        section.properties.push(properties.status);
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
            properties.socialOrigins,
        ],
    });

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
            title: 'Procédure judiciaire',
            properties: [
                properties.ownerComplaint,
                properties.justiceProcedure,
                properties.justiceRendered,
                properties.justiceRenderedAt,
                properties.justiceRenderedBy,
                properties.justiceChallenged,
                properties.policeStatus,
                properties.policeRequestedAt,
                properties.policeGrantedAt,
                properties.bailiff,
            ],
        });
    }

    if (options.indexOf('actors') !== -1) {
        sections.push({
            title: 'Intervenants',
            properties: [
                properties.actors,
            ],
        });
    }

    if (closedTowns === true) {
        const subSections = [];
        closingSolutions.forEach(({ id: solutionId, label }) => {
            subSections.push({
                title: label.split(' (')[0],
                properties: [
                    properties[`closingSolution${solutionId}_population`],
                    properties[`closingSolution${solutionId}_households`],
                ],
            });
        });

        sections.push({
            title: 'Orientation',
            subsections: subSections,
        });
    }

    const commentProps = [];
    if (options.indexOf('comments') !== -1 && user.isAllowedTo('list', 'shantytown_comment')) {
        commentProps.push(properties.comments);
    }

    if (options.indexOf('covid_comments') !== -1) {
        commentProps.push(properties.covidComments);
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
