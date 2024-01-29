import ServiceError from '#server/errors/ServiceError';
import contactFormReferralModel from '#server/models/contactFormReferralModel';
import getPermission from '#server/utils/permission/getPermission';
import { User } from '#root/types/resources/User.d';

const { list } = contactFormReferralModel;

type ContactFormReferralExportRow = {
    Prénom: string;
    'Nom de famille': string;
    Courriel: string;
    'Départements d\'intervention': string;
    Organisation: string;
    Raison: string;
    'Raison autre': string;
    'Raison bouche à oreille': string;
};

export default async (user: User): Promise<ContactFormReferralExportRow[]> => {
    const permission = getPermission(user, 'access', 'contact_form_referral');
    if (permission === null) {
        return [];
    }

    let referrals: Awaited<ReturnType<typeof list>>;
    try {
        referrals = await list(permission);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    return referrals.map(row => ({
        Prénom: row.first_name,
        'Nom de famille': row.last_name,
        Courriel: row.email,
        'Départements d\'intervention': row.departements ? row.departements.join(', ') : 'utilisateur non départemental',
        Organisation: row.organization_name,
        Raison: row.reason,
        'Raison autre': row.reason_other,
        'Raison bouche à oreille': row.reason_word_of_mouth,
    }));
};
