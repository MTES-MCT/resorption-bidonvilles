import fs from 'node:fs';
import path from 'node:path';
import config from '#server/config';
import mailsUtils from '#server/utils/mail';
import renderMailjetTemplate from '../mails/renderMailjetTemplate';

const { send: sendMail } = mailsUtils;
const {
    wwwUrl, webappUrl, backUrl, testEmail,
} = config;

type Recipient = {
    email: string,
    first_name: string,
    last_name: string,
};

type SendOptions = {
    recipient: Recipient,
    preserveRecipient?: boolean,
    variables?: { [key: string]: any },
    replyTo?: Recipient | null,
    bcc?: Recipient[],
};

export default {
    PRESERVE_RECIPIENT: true,

    /**
     * Sends one of the email templates stored in `/mails`
     *
     * @param {string}  templateName Name of the email template (may be a path, without trailing .js)
     * @param {Object}  options Name of the email template (may be a path, without trailing .js)
     * @returns {Promise}
     */
    async send(templateName: string, options: SendOptions): Promise<{ status: number }> | null {
        const {
            recipient, preserveRecipient = true, variables = {}, replyTo = null, bcc = [],
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

        const htmlContent = fs.readFileSync(path.join(__dirname, '../mails/dist', `${templateName}.html`)).toString();
        const textContent = fs.readFileSync(path.join(__dirname, '../mails/dist', `${templateName}.text`)).toString();
        const subject = fs.readFileSync(path.join(__dirname, '../mails/dist', `${templateName}.subject.text`)).toString();

        const templateVariables = {
            wwwUrl,
            webappUrl,
            backUrl,
            recipientName: `${recipient.first_name} ${recipient.last_name}`,
            ...variables,
        };

        const [renderedHtml, renderedText, renderedSubject] = await Promise.all([
            renderMailjetTemplate(htmlContent, templateVariables),
            renderMailjetTemplate(textContent, templateVariables),
            renderMailjetTemplate(subject, templateVariables),
        ]);

        return sendMail(
            finalRecipient,
            {
                HTMLPart: renderedHtml,
                TextPart: renderedText,
                Subject: renderedSubject,
            },
            replyTo,
            bcc,
        );
    },
};
