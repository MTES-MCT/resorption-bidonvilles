const ServiceError = require('#server/errors/ServiceError');
const { list } = require('#server/models/contactFormReferralModel');
const { where: fWhere } = require('#server/utils/permission');

module.exports = async (user) => {
    const permissionClauseGroup = fWhere().can(user).do('access', 'contact_form_referral');
    if (permissionClauseGroup === null) {
        return [];
    }

    const where = [];
    if (Object.keys(permissionClauseGroup).length > 0) {
        where.push([permissionClauseGroup]);
    }

    let referrals;
    try {
        referrals = await list(where);
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
