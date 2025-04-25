import actionActorModel from '#server/models/actionActorModel/index';
import mails from '#server/mails/mails';

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
    await Promise.all(
        actors.map(actor => sender[variant](
            { email: actor.email, first_name: actor.first_name, last_name: actor.last_name },
            {
                variables: {
                    actions: actor.actions,
                },
            },
        )),
    );
};
