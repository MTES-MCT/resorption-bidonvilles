import { Request, Response } from 'express';

import dateUtils from '#server/utils/date';

import userService from '#server/services/userService';
import accessRequestService from '#server/services/accessRequest/accessRequestService';

import mailsUtils from '#server/mails/mails';

import userModel from '#server/models/userModel';
import contactFormReferralModel from '#server/models/contactFormReferralModel';
import { SerializedUser } from '#server/models/userModel/_common/types/SerializedUser.d';
import { SerializedOrganization } from '#server/models/userModel/getDirectory';

import { OrganizationCategory } from '#root/types/resources/OrganizationCategory.d';
import { ContactRequestType } from '#root/types/resources/ContactRequestType.d';
import { ContactReferral } from '#root/types/resources/ContactReferral.d';

const { toString: dateToString } = dateUtils;
const { sendAdminContactMessage, sendContactNewsletterRegistration } = mailsUtils;

interface MessageData {
    email: string,
    phone: string,
    last_name: string,
    first_name: string,
    access_request_message: string,
    objet: string,
    is_organization_other: boolean,
    organization_other: string,
}

async function sendEmailNewContactMessageToAdmins(message: MessageData): Promise<void> {
    const admins = await userModel.getNationalAdmins();

    for (let i = 0; i < admins.length; i += 1) {
        sendAdminContactMessage(admins[i], {
            variables: {
                message: {
                    created_at: dateToString(new Date()),
                    ...message,
                },
            },
            preserveRecipient: false,
            replyTo: {
                email: message.email,
                last_name: message.last_name,
                first_name: message.first_name,
            },
        });
    }
}

function getObjetForContactMessage(requestType: ContactRequestType[]): string {
    const types: { [key in ContactRequestType]: string } = {
        'access-request': 'Demande de création de compte',
        help: 'Aider',
        report: 'Signaler',
        'help-request': "Demander de l'aide",
        'info-request': 'Demander des infos',
        'register-newsletter': 'Vous abonner à la lettre d\'info',
        'submit-blog-post': 'Proposer un article pour le blog',
    };
    return requestType.map(type => types[type]).join(' - ');
}

interface ContactRequest extends Request {
    body: {
        request_type: ContactRequestType[],
        is_actor: boolean,
        referral: ContactReferral,
        referral_other: string,
        referral_word_of_mouth?: string,
        last_name: string,
        first_name: string,
        email: string,
        phone: string,
        position: string,
        access_request_message: string,
        organization_category: OrganizationCategory,
        organization_full: SerializedOrganization,
        new_association: boolean,
        new_association_name: string,
        new_association_abbreviation: string,
        departement: string,
        organization_other: string,
    }
}

// Fonction pour traiter la requête
export default async (req: ContactRequest, res: Response, next): Promise<void> => {
    const {
        request_type, is_actor, referral, referral_other, referral_word_of_mouth,
        last_name, first_name, email, phone, access_request_message, organization_category,
    } = req.body;

    // send mail to sales@ if a newsletter registration was asked
    if (request_type.includes('register-newsletter')) {
        try {
            await sendContactNewsletterRegistration(
                { email: 'sales@resorption-bidonvilles.beta.gouv.fr', first_name: 'Équipe Sales', last_name: 'Résorption Bidonvilles' },
                {
                    variables: {
                        email,
                    },
                    preserveRecipient: true,
                    replyTo: {
                        email,
                        last_name,
                        first_name,
                    },
                },
            );
        } catch (error) {
        // @todo: call sentry to register this error
        }
    }

    if (request_type.includes('access-request') && is_actor && organization_category !== 'other') {
        // create the user
        let result: SerializedUser;
        try {
            result = await userService.create({
                last_name,
                first_name,
                email,
                phone,
                organization: req.body.organization_full
                    ? req.body.organization_full.id
                    : null,
                new_association: req.body.new_association === true,
                new_association_name: req.body.new_association_name || null,
                new_association_abbreviation:
                    req.body.new_association_abbreviation || null,
                departement: req.body.departement || null,
                position: req.body.position,
                access_request_message,
            });
        } catch (error) {
            res.status(500).send('Une erreur est survenue lors de l\'écriture en base de données');
            return;
        }

        try {
            const user = await userModel.findOne(result.id, { extended: true });
            await accessRequestService.handleNewAccessRequest(user);

            if (referral !== null) {
                await contactFormReferralModel.create({
                    reason: referral,
                    reason_other: referral_other,
                    reason_word_of_mouth: referral_word_of_mouth,
                    fk_user: user.id,
                });
            }
        } catch (err) {
            next(err);
        }

        res.status(200).send(result);
        return;
    }

    try {
        const isNewOrganization:boolean = request_type.includes('access-request') && is_actor && organization_category === 'other';
        await sendEmailNewContactMessageToAdmins({
            email: req.body.email,
            phone: req.body.phone,
            last_name: req.body.last_name,
            first_name: req.body.first_name,
            access_request_message: req.body.access_request_message,
            objet: getObjetForContactMessage(request_type),
            is_organization_other: isNewOrganization,
            organization_other: isNewOrganization ? req.body.organization_other : '',
        });
        if (req.body.referral !== null) {
            await contactFormReferralModel.create({
                reason: req.body.referral,
                reason_other: req.body.referral_other,
                reason_word_of_mouth: req.body.referral_word_of_mouth,
            });
        }
    } catch (err) {
        next(err);
    }

    res.status(200).send();
};
