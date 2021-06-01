const nodeMailjet = require('node-mailjet');
const { mail: mailConfig, frontUrl } = require('#server/config');

const mailjet = nodeMailjet.connect(mailConfig.publicKey, mailConfig.privateKey);

module.exports = {
    generateUserSignature(user) {
        const signature = [
            `${user.first_name} ${user.last_name.toUpperCase()}`,
            `${user.position} - ${user.organization.type.abbreviation || user.organization.name}${user.organization.location.departement !== null ? ` - ${user.organization.location.departement.code}` : ''}`,
            `${user.role} de resorption-bidonvilles.com`,
        ];

        return {
            TextPart: signature.join('\n'),
            HTMLPart: signature.join('<br/>').replace('resorption-bidonvilles.com', `<a href="${frontUrl}">resorption-bidonvilles.com</a>`),
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
