const sequelize = require('#db/sequelize');

module.exports = async ({
    reason,
    reason_other = null,
    reason_word_of_mouth = null,
    fk_user = null,
}, transaction = undefined) => {
    const result = await sequelize.query(
        `INSERT INTO contact_form_referrals(
            reason,
            reason_other,
            reason_word_of_mouth,
            fk_user
        ) VALUES (
            :reason,
            :reason_other,
            :reason_word_of_mouth,
            :fk_user
        ) RETURNING contact_form_referral_id AS id`, {
            replacements: {
                reason,
                reason_other,
                reason_word_of_mouth,
                fk_user,
            },
            transaction,
        },
    );

    return result[0][0].id;
};
