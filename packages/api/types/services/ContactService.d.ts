import { ContactRequestType } from '#root/types/resources/ContactRequestType.d';

export type ContactServiceNotifyData = {
    email: string,
    phone: string,
    first_name: string,
    last_name: string,
    access_request_message: string,
    request_type: ContactRequestType,
    is_new_organization: boolean,
    organization_other: string,
};

export type ContactServiceReferralData = {
    referral: string,
    referral_other?: string,
    referral_word_of_mouth?: string,
    user_id?: number
};
