import nodeMailjet from 'node-mailjet';
import config from '#server/config';
import userModelFactory from '#server/models/userModel';

const { mail: mailConfig, wwwUrl } = config;
const userModel = userModelFactory();

const mailjet = nodeMailjet.connect(
    mailConfig.publicKey || 'unknown',
    mailConfig.privateKey || 'unknown',
);

export default {
    generateUserSignature(user) {
        const signature = [
            `${userModel.formatName(user)}`,
            `${user.position} - ${user.organization.type.abbreviation || user.organization.name}${user.organization.location.departement !== null ? ` - ${user.organization.location.departement.code}` : ''}`,
            `${user.role} de resorption-bidonvilles.com`,
        ];

        return {
            TextPart: signature.join('\n'),
            HTMLPart: signature.join('<br/>').replace('resorption-bidonvilles.com', `<a href="${wwwUrl}">resorption-bidonvilles.com</a>`),
        };
    },

    send(user, mailContent, replyTo = null) {
        return mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    Object.assign({
                        From: {
                            Email: 'contact@resorption-bidonvilles.beta.gouv.fr',
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
                    }, mailContent),
                ],
            });
    },
};
