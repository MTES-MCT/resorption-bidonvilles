import userModel from '#server/models/userModel';
import mailsUtils from '#server/mails/mails';
import dateUtils from '#server/utils/date';
import { ContactRequestType } from '#root/types/resources/ContactRequestType.d';
import { ContactServiceNotifyData } from '#root/types/services/ContactService.d';

const { toString: dateToString } = dateUtils;
const { sendAdminContactMessage } = mailsUtils;

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

function getObjetForContactMessage(requestType: ContactRequestType): string {
    const types: { [key in ContactRequestType]: string } = {
        'access-request': 'Demande de création de compte',
        help: 'Aider',
        report: 'Signaler',
        'help-request': "Demander de l'aide",
        'info-request': 'Demander des infos',
        'register-newsletter': 'Vous abonner à la lettre d\'info',
        'submit-blog-post': 'Proposer un article pour le blog',
    };

    return types[requestType];
}

export default (data: ContactServiceNotifyData): Promise<void> => sendEmailNewContactMessageToAdmins({
    email: data.email,
    phone: data.phone,
    last_name: data.last_name,
    first_name: data.first_name,
    access_request_message: data.access_request_message,
    objet: getObjetForContactMessage(data.request_type),
    is_organization_other: data.is_new_organization,
    organization_other: data.is_new_organization ? data.organization_other : '',
});
