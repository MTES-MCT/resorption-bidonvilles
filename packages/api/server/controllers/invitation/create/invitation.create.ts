import mailsUtils from '#server/mails/mails';
import mattermostUtils from '#server/utils/mattermost';
import config from '#server/config';
import userModel from '#server/models/userModel';

const { sendUserPlatformInvitation } = mailsUtils;
const { triggerPeopleInvitedAlert } = mattermostUtils;
const { mattermost } = config;
const { formatName } = userModel;

async function sendEmailsInvitations(guests, greeter) {
    for (let i = 0; i < guests.length; i += 1) {
        const guest = {
            first_name: guests[i].first_name,
            last_name: guests[i].last_name,
            email: guests[i].email,
        };

        try {
            // eslint-disable-next-line no-await-in-loop
            await sendUserPlatformInvitation(guest, {
                variables: {
                    inviterName: formatName(greeter),
                },
            });
        } catch (err) {
            // Ignore
        }
    }
}

async function sendMattermostNotifications(guests, greeter, invite_from) {
    if (!mattermost) {
        return;
    }
    let from = null;
    // invite_from is initialized in pages/Contact/index.vue or in api/server/amils/mails.js (see sendUserShare)
    if (invite_from === 'access_request') {
        from = "via le formulaire de demande d'accès";
    } else if (invite_from === 'contact_others') {
        from = "via le formulaire de contact (signaler / aider / demander des infos / demander de l'aide / demander un accès)";
    } else if (invite_from === 'push_mail') {
        from = 'via push mail J+15';
    } else if (invite_from === 'navbar') {
        from = 'via le menu de navigation';
    } else if (invite_from === 'annuaire') {
        from = 'via l\'annuaire';
    } else {
        from = 'via une origine inconnue';
    }

    const greeterUser = await userModel.findOneByEmail(greeter.email);
    if (greeterUser !== null) {
        greeter.id = greeterUser.id;
    }

    for (let i = 0; i < guests.length; i += 1) {
        // Send a mattermost alert, if it fails, do nothing
        try {
            // eslint-disable-next-line no-await-in-loop
            await triggerPeopleInvitedAlert(guests[i], greeter, from);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(`Error with invited people mattermost webhook : ${Object.entries(err.message).flat()}`);
        }
    }
}

export default async (req, res, next) => {
    const { greeter, guests, invite_from } = req.body;

    // Send an email to each guest
    try {
        await sendEmailsInvitations(guests, greeter);
    } catch (err) {
        res.status(500).send({
            user_message: 'Impossible d\'envoyer les invitations',
        });
        return next(err);
    }

    // Send a mattermost alert for each guest
    try {
        // La méthode qui suit attend l'id de l'utilisateur pour l'accès à sa fiche sur la lateforme. 
        // Or, l'id n'est pas contenu dans l'objet "greeter"
        await sendMattermostNotifications(guests, greeter, invite_from);
    } catch (err) {
        // ignore
    }

    return res.status(200).send({});
};
