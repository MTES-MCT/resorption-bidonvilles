const { can } = require('#server/utils/permission');

const locationTypes = {
    shantytowns: 'sur site(s) : bidonville ou squat',
    location: 'sur terrain d\'insertion',
    housing: 'dans le logement',
    other: 'dans plusieurs lieux (hébergement, permanence, rue...)',
};

module.exports = (user, permissions, plan) => {
    const base = {
        type: 'plan',
        id: plan.id,
        name: plan.name,
        started_at: new Date(plan.startedAt).getTime(),
        expected_to_end_at: plan.expectedToEndAt ? (new Date(plan.expectedToEndAt).getTime()) : null,
        closed_at: plan.closedAt ? new Date(plan.closedAt).getTime() : null,
        updated_at: plan.updatedAt ? new Date(plan.updatedAt).getTime() : null,
        in_and_out: plan.inAndOut === true,
        goals: plan.goals,
        location_type: {
            id: plan.locationType,
            label: locationTypes[plan.locationType],
        },
        location_details: plan.locationDetails,
        final_comment: plan.finalComment,
        government_contacts: plan.managers,
        departement: {
            code: plan.departement_code,
            name: plan.departement_name,
        },
        region: {
            code: plan.region_code,
            name: plan.region_name,
        },
        geo_location: {
            type: 'departement',
            region: {
                code: plan.region_code,
                name: plan.region_name,
            },
            departement: {
                code: plan.departement_code,
                name: plan.departement_name,
            },
            epci: null,
            city: null,
        },
        operator_contacts: plan.operators,
        states: plan.states || [],
        topics: plan.topics,
        createdBy: plan.createdBy,
        updatedBy: plan.updatedBy,
        canUpdate: can(user).do('update', 'plan').on(plan),
        canUpdateMarks: can(user).do('updateMarks', 'plan').on(plan),
        canClose: can(user).do('close', 'plan').on(plan),
    };

    if (!plan.finances || permissions.finances === null || permissions.finances.allowed !== true) {
        base.finances = [];
    } else {
        const minYear = plan.finances.slice(-1)[0].year;
        const currentYear = (new Date()).getFullYear();

        const finances = [];
        for (let y = currentYear; y >= minYear; y -= 1) {
            const finance = plan.finances.find(({ year }) => year === y);
            finances.push({
                year: y,
                data: finance ? finance.data : [],
            });
        }

        base.finances = finances;
    }

    base.audience = base.states.reduce((acc, { audience }) => {
        // in
        acc.total += audience.in.total;
        acc.families += audience.in.families;
        acc.women += audience.in.women;
        acc.minors += audience.in.minors;

        // out
        ['out_positive', 'out_abandoned', 'out_excluded'].forEach((key) => {
            if (audience[key]) {
                acc.total -= audience[key].total;
                acc.families -= audience[key].families;
                acc.women -= audience[key].women;
                acc.minors -= audience[key].minors;
            }
        });

        return acc;
    }, {
        total: 0,
        families: 0,
        women: 0,
        minors: 0,
    });

    base.last_update = null;
    if (base.states.length > 0) {
        const lastState = base.states.slice(-1)[0];
        base.last_update = new Date(lastState.date).getTime();
    }

    switch (plan.locationType) {
        case 'location':
            base.location = {
                label: plan.location_address_simple,
                address: plan.location_address,
                latitude: plan.location_latitude,
                longitude: plan.location_longitude,
            };
            break;

        case 'shantytowns':
            base.shantytowns = plan.shantytowns;
            break;

        default:
    }

    return base;
};
