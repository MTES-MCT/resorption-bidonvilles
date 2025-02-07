import Mailjet from 'node-mailjet';
import config from '#server/config';

const { mail: mailConfig } = config;
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

        return mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    Object.assign({
                        From: {
<<<<<<< HEAD
                            Email: 'contact-resorption-bidonvilles@dihal.gouv.fr',
=======
                            Email: ' contact-resorption-bidonvilles@dihal.gouv.fr',
>>>>>>> 4d440360e (fix: Correction de l'émetteur des courriels)
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
                    }, mailContent),
                ],
            });
    },
};
