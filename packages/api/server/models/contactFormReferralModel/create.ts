import { Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

type ContactReferralCreateInput = {
    reason: string,
    reason_other?: string | null,
    reason_word_of_mouth?: string | null,
    fk_user?: number | null,
};

export default async ({
    reason,
    reason_other = null,
    reason_word_of_mouth = null,
    fk_user = null,
}: ContactReferralCreateInput, transaction: Transaction = undefined): Promise<number> => {
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

    type ReturnValue = { id: number };
    const rows: ReturnValue[] = (result[0] as unknown) as ReturnValue[];

    return rows[0].id;
};
