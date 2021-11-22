const ServiceError = require('#server/errors/ServiceError');
const { list } = require('#server/models/contactFormReferralModel')();

module.exports = async (user) => {
    if (!user || !user.permissions || !user.permissions.contact_form_referral || !user.permissions.contact_form_referral.access) {
        return [];
    }

    const { allowed, geographic_level: allowedLevel } = user.permissions.contact_form_referral.access;
    if (!allowed) {
        return [];
    }

    const { location: userLocation } = user.organization;
    let allowedLocation = null;
    if (allowedLevel !== 'nation' && userLocation.type !== 'nation') {
        if (userLocation.type === 'region') {
            allowedLocation = { type: 'region', ...userLocation.region };
        } else {
            allowedLocation = { type: 'departement', ...userLocation.departement };
        }
    }

    let referrals;
    try {
        referrals = await list(allowedLocation);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    return referrals.map(row => ({
        Prénom: row.first_name,
        'Nom de famille': row.last_name,
        Courriel: row.email,
        'Code département': row.departement_code,
        Organisation: row.organization_name,
        Raison: row.reason,
        'Raison autre': row.reason_other,
        'Raison bouche à oreille': row.reason_word_of_mouth,
    }));
};
