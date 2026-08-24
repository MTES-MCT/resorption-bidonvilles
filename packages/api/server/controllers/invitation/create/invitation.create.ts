import mailsUtils from '#server/mails/mails';
import tchapUtils from '#server/utils/tchap';
import userModel from '#server/models/userModel';
import { User } from '#root/types/resources/User.d';

const { sendUserPlatformInvitation } = mailsUtils;
const { triggerPeopleInvitedAlert } = tchapUtils;
const { formatName } = userModel;

type Greeter = {
    first_name: string,
    last_name: string,
    email: string,
};

async function sendEmailsInvitations(guests: { first_name: string; last_name: string; email: string }[], greeter: Greeter) {
    guests.forEach((originalGuest) => {
        const guest = {
            first_name: originalGuest.first_name,
            last_name: originalGuest.last_name,
            email: originalGuest.email,
        };

        try {
            sendUserPlatformInvitation(guest, {
                variables: {
                    inviterName: formatName(greeter),
                },
            });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error with invited people email :', err.message);
        }
    });
}

async function sendTchapNotifications(guests: { first_name: string; last_name: string; email: string }[], greeter: Greeter, invite_from: string) {
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
    const greeterWithId: Partial<User> = {
        ...greeter,
        id: greeterUser ? greeterUser.id : null,
    };

    const users: Partial<User>[] = guests.map((guest) => ({
        first_name: guest.first_name,
        last_name: guest.last_name,
        email: guest.email,
    }));

    try {
        await triggerPeopleInvitedAlert(users as User[], greeterWithId as User, from);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err.message);
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

    // Send a Tchap alert for each guest
    try {
        await sendTchapNotifications(guests, greeter, invite_from);
    } catch (err) {
    // eslint-disable-next-line no-console
        console.error(err);
    }

    return res.status(200).send({});
};
