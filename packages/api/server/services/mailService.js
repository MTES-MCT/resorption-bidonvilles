/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');
const { frontUrl, backUrl } = require('#server/config');

const { send: sendMail } = require('#server/utils/mail');
const { testEmail } = require('#server/config');

module.exports = {
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
            recipient, sender = null, preserveRecipient = true, variables,
        } = options;

        console.log(variables);

        let finalRecipient = recipient;
        if (testEmail && !preserveRecipient) {
            finalRecipient = {
                email: testEmail,
                first_name: 'Service',
                last_name: 'Qualité',
            };
        }

        const htmlContent = fs.readFileSync(path.join(__dirname, '../mails/dist', `${templateName}.html`));
        const textContent = fs.readFileSync(path.join(__dirname, '../mails/dist', `${templateName}.text`));
        const subject = fs.readFileSync(path.join(__dirname, '../mails/dist', `${templateName}.subject.text`));

        return sendMail(
            finalRecipient,
            {
                HTMLPart: htmlContent.toString(),
                TextPart: textContent.toString(),
                Subject: subject.toString(),
                TemplateLanguage: true,
                Variables: {
                    frontUrl,
                    backUrl,
                    recipientName: `${recipient.first_name} ${recipient.last_name}`,
                    ...variables,
                },
            },
            sender,
        );
    },
};
