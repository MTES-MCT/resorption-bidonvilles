const { trim } = require('validator');

module.exports = (data) => {
    const sanitizedData = {};

    // name
    if (typeof data.name === 'string') {
        sanitizedData.name = trim(data.name);
    }

    // departement
    if (typeof data.departement === 'string') {
        sanitizedData.departement = trim(data.departement);
    }

    // started at
    const startedAt = new Date(data.startedAt);
    if (!Number.isNaN(startedAt.getTime())) {
        sanitizedData.startedAt = startedAt;
    }

    // expected to end at
    if (data.expectedToEndAt === undefined || data.expectedToEndAt === null) {
        sanitizedData.expectedToEndAt = null;
    } else {
        const expectedToEndAt = new Date(data.expectedToEndAt);
        if (!Number.isNaN(expectedToEndAt.getTime())) {
            sanitizedData.expectedToEndAt = expectedToEndAt;
        }
    }

    // in and out
    if (data.in_and_out === 1) {
        sanitizedData.inAndOut = true;
    } else if (data.in_and_out === 0) {
        sanitizedData.inAndOut = false;
    }

    // topics
    if (Array.isArray(data.topics)) {
        sanitizedData.topics = data.topics;
    }

    // goals
    if (typeof data.goals === 'string') {
        sanitizedData.goals = trim(data.goals);
    }

    // location
    if (typeof data.locationType === 'string') {
        sanitizedData.locationType = data.locationType;
    }

    switch (data.locationType) {
        case 'shantytowns':
            if (Array.isArray(data.locationShantytowns)) {
                sanitizedData.locationShantytowns = data.locationShantytowns;
            } else {
                sanitizedData.locationShantytowns = [];
            }
            break;

        case 'location':
            if (data.locationAddress && data.locationAddress.address && data.locationAddress.location) {
                sanitizedData.locationAddress = {
                    latitude: data.locationAddress.location.coordinates[0],
                    longitude: data.locationAddress.location.coordinates[1],
                    address: data.locationAddress.address.label,
                };
            } else {
                sanitizedData.locationAddress = null;
            }
            break;

        case 'other':
            if (typeof data.locationDetails === 'string') {
                sanitizedData.locationDetails = trim(data.locationDetails);
            }
            break;

        default:
        case 'housing':
            break;
    }

    if (!sanitizedData.locationDetails) {
        sanitizedData.locationDetails = null;
    }

    // government contact
    if (Array.isArray(data.government)) {
        if (data.government.length === 0) {
            sanitizedData.government = null;
        } else {
            [sanitizedData.government] = data.government;
        }
    }

    // association contact
    if (Array.isArray(data.association)) {
        if (data.association.length === 0) {
            sanitizedData.association = null;
        } else {
            [sanitizedData.association] = data.association;
        }
    }

    if (data.contact === undefined || data.contact === null) {
        sanitizedData.associationContact = null;
    } else {
        sanitizedData.associationContact = parseInt(data.contact, 10);
    }

    // fundings
    const currentYear = (new Date()).getFullYear();
    if (Array.isArray(data.finances)) {
        sanitizedData.finances = data.finances
            .filter(({ data: d }) => d && d.length > 0)
            .map(({ year, data: d }) => ({
                year: parseInt(year, 10),
                data: d.map(({
                    type, amount, realAmount, details,
                }) => ({
                    type: type !== null ? type : null,
                    amount: parseFloat(amount),
                    realAmount: parseInt(year, 10) < currentYear && realAmount ? parseFloat(realAmount) : null,
                    details: trim(details),
                })),
            }));
    }

    return sanitizedData;
};
