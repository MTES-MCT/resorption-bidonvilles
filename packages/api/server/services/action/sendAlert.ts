import actionActorModel from '#server/models/actionActorModel/index';
import mails from '#server/mails/mails';
import sendMailsWithConcurrencyLimit from '#server/utils/sendMailsWithConcurrencyLimit';

type ActionAlertVariant = 'preshot' | 'postshot';
const sender = {
    preshot: mails.sendActionAlertPreshot,
    postshot: mails.sendActionAlertPostshot,
};

export default async (variant: ActionAlertVariant): Promise<void> => {
    let year = new Date().getFullYear();
    if (variant === 'postshot') {
        year -= 1;
    }

    const actors = await actionActorModel.findAll(year, true);
    await sendMailsWithConcurrencyLimit(actors, actor => sender[variant](
        { email: actor.email, first_name: actor.first_name, last_name: actor.last_name },
        {
            variables: {
                actions: actor.actions,
            },
        },
    ));
};
