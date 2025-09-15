import Mailjet from 'node-mailjet';
import config from '#server/config';

const { mail: mailConfig, logInProd } = config;
const mailjet = mailConfig.publicKey
    ? new Mailjet({
        apiKey: mailConfig.publicKey,
        apiSecret: mailConfig.privateKey,
    })
    : null;

export default {
    send(user, mailContent, replyTo = null, bcc = []) {
        if (mailjet === null) {
            return null;
        }

        const sendingMail = mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: 'contact-resorption-bidonvilles@dihal.gouv.fr',
                            Name: 'Résorption Bidonvilles',
                        },
                        ReplyTo: replyTo !== null ? {
                            Email: replyTo.email,
                            Name: `${replyTo.last_name.toUpperCase()} ${replyTo.first_name}`,
                        } : undefined,
                        To: [
                            {
                                Email: user.email,
                                Name: user.first_name && user.last_name
                                    ? `${user.first_name} ${user.last_name.toUpperCase()}`
                                    : undefined,
                            },
                        ],
                        Bcc: bcc?.length > 0 ? bcc.map(r => ({
                            Email: r.email,
                            Name: `${r.last_name.toUpperCase()} ${r.first_name}`,
                        })) : undefined,
                        ...mailContent,
                    },
                ],
            }).then((result) => {
                if (logInProd) {
                    // eslint-disable-next-line no-console
                    console.log('Envoi du mail à', user.email, 'Retour:', result.body);
                }
            });

        return sendingMail;
    },
};
