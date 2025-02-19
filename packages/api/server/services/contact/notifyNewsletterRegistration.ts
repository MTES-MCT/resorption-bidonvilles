import mailsUtils from '#server/mails/mails';
import { EmailRecipient } from '#root/types/resources/EmailRecipient.d';

export default async (recipient: EmailRecipient): Promise<void> => {
    await mailsUtils.sendContactNewsletterRegistration(
        {
            email: 'sales@resorption-bidonvilles.dihal.gouv.fr',
            first_name: 'Équipe Sales',
            last_name: 'Résorption Bidonvilles',
        },
        {
            variables: {
                email: recipient.email,
            },
            preserveRecipient: true,
            replyTo: {
                email: recipient.email,
                last_name: recipient.last_name,
                first_name: recipient.first_name,
            },
        },
    );
};
