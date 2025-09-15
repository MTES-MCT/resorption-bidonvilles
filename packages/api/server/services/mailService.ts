import fs from 'fs';
import path from 'path';
import config from '#server/config';
import mailsUtils from '#server/utils/mail';

const { send: sendMail } = mailsUtils;
const {
    wwwUrl, webappUrl, backUrl, testEmail, logInProd,
} = config;

export default {
    PRESERVE_RECIPIENT: true,

    /**
     * Sends one of the email templates stored in `/mails`
     *
     * @param {string}  templateName Name of the email template (may be a path, without trailing .js)
     * @param {Object}  options Name of the email template (may be a path, without trailing .js)
     * @returns {Promise}
     */
    send(templateName, options) {
        const {
            recipient, preserveRecipient = true, variables, replyTo = null, bcc = [],
        } = options;

        let finalRecipient = recipient;
        if (testEmail && !preserveRecipient) {
            finalRecipient = {
                email: testEmail,
                first_name: 'Service',
                last_name: 'Qualité',
            };
            bcc.splice(0, bcc.length);
        }

        const htmlContent = fs.readFileSync(path.join(__dirname, '../mails/dist', `${templateName}.html`));
        const textContent = fs.readFileSync(path.join(__dirname, '../mails/dist', `${templateName}.text`));
        const subject = fs.readFileSync(path.join(__dirname, '../mails/dist', `${templateName}.subject.text`));

        if (logInProd) {
            // eslint-disable-next-line no-console
            console.log('Envoi du mail', templateName, 'à', finalRecipient.email, 'avec un fichier HTML', htmlContent.length, 'octets et un fichier texte de', textContent.length, 'octets');
        }

        return sendMail(
            finalRecipient,
            {
                HTMLPart: htmlContent.toString(),
                TextPart: textContent.toString(),
                Subject: subject.toString(),
                TemplateLanguage: true,
                Variables: {
                    wwwUrl,
                    webappUrl,
                    backUrl,
                    recipientName: `${recipient.first_name} ${recipient.last_name}`,
                    ...variables,
                },
            },
            replyTo,
            bcc,
        );
    },
};
