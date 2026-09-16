import { BrevoClient, Brevo } from '@getbrevo/brevo';
import config from '#server/config';

type Recipient = {
    email: string,
    first_name?: string,
    last_name?: string,
};

type MailContent = {
    HTMLPart: string,
    TextPart: string,
    Subject: string,
};

const { mail: mailConfig, environnement } = config;
const brevo = mailConfig.apiKey
    ? new BrevoClient({ apiKey: mailConfig.apiKey })
    : null;
const expeditorAddress: string | undefined = environnement === 'development'
    ? (mailConfig.expeditorDevAddress || mailConfig.expeditorAddress)
    : mailConfig.expeditorAddress;

export default {
    send(
        user: Recipient,
        mailContent: MailContent,
        replyTo: Recipient | null = null,
        bcc: Recipient[] = [],
    ): Promise<Brevo.SendTransacEmailResponse> | null {
        if (brevo === null) {
            return null;
        }

        const {
            HTMLPart: htmlContent, TextPart: textContent, Subject: subject,
        } = mailContent;

        const request: Brevo.SendTransacEmailRequest = {
            sender: {
                email: expeditorAddress,
                name: 'Résorption Bidonvilles',
            },
            replyTo: replyTo !== null ? {
                email: replyTo.email,
                name: `${replyTo.last_name.toUpperCase()} ${replyTo.first_name}`,
            } : undefined,
            to: [
                {
                    email: user.email,
                    name: user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name.toUpperCase()}`
                        : undefined,
                },
            ],
            bcc: bcc.length > 0 ? bcc.map(r => ({
                email: r.email,
                name: `${r.last_name.toUpperCase()} ${r.first_name}`,
            })) : undefined,
            subject,
            htmlContent,
            textContent,
        };

        return brevo.transactionalEmails.sendTransacEmail(request);
    },
};
