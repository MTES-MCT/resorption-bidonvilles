import contactFormReferralModel from '#server/models/contactFormReferralModel';
import { ContactServiceReferralData } from '#root/types/services/contactService.d';

export default (data: ContactServiceReferralData): Promise<number> => contactFormReferralModel.create({
    reason: data.referral,
    reason_other: data.referral_other,
    reason_word_of_mouth: data.referral_word_of_mouth,
    fk_user: data.user_id,
});
