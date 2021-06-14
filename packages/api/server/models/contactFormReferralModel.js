module.exports = database => ({
    async create({
        reason,
        reason_other = null,
        fk_user = null,
    }, transaction = undefined) {
        const result = await database.query(
            `INSERT INTO contact_form_referral(
                reason,
                reason_other,
                fk_user
            ) VALUES (
              :reason,
              :reason_other,
              :fk_user
            ) RETURNING contact_form_referral_id AS id`, {
                replacements: {
                    reason,
                    reason_other,
                    fk_user,
                },
                transaction,
            },
        );

        return result[0][0].id;
    },
});
