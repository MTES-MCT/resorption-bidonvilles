import { type Response } from 'express';
import * as Sentry from '@sentry/node';
import mailsUtils from '#server/mails/mails';
import tchapUtils from '#server/utils/tchap';
import userModel from '#server/models/userModel';
import { User } from '#root/types/resources/User.d';
import { InvitationCreateRequest, InvitationGuest, InvitationGreeter } from '#root/types/resources/InvitationCreateRequestInterface.d';

const { sendUserPlatformInvitation } = mailsUtils;
const { triggerPeopleInvitedAlert } = tchapUtils;
const { formatName } = userModel;

async function sendEmailsInvitations(guests: InvitationGuest[], greeter: InvitationGreeter): Promise<void> {
    await Promise.all(guests.map(async (originalGuest) => {
        const guest = {
            first_name: originalGuest.first_name,
            last_name: originalGuest.last_name,
            email: originalGuest.email,
        };

        try {
            await sendUserPlatformInvitation(guest, {
                variables: {
                    inviterName: formatName(greeter),
                },
            });
        } catch (err) {
            Sentry.captureException(err);
        }
    }));
}

async function sendTchapNotifications(guests: InvitationGuest[], greeter: InvitationGreeter, invite_from: string): Promise<void> {
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

    const users: Partial<User>[] = guests.map(guest => ({
        first_name: guest.first_name,
        last_name: guest.last_name,
        email: guest.email,
    }));

    await triggerPeopleInvitedAlert(users as User[], greeterWithId as User, from);
}

export default async function createInvitation(req: InvitationCreateRequest, res: Response) {
    const { greeter, guests, invite_from } = req.body;

    // Send an email to each guest
    await sendEmailsInvitations(guests, greeter);

    // Send a Tchap alert for each guest
    try {
        await sendTchapNotifications(guests, greeter, invite_from);
    } catch (err) {
        Sentry.captureException(err);
    }

    return res.status(200).send({});
}
