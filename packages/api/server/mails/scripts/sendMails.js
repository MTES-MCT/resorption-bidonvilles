const { toString: dateToString } = require('#server/utils/date');

const {
    formatName,
    sendAdminNewRequestNotification,
    sendAdminRequestPendingReminder1,
    sendAdminRequestPendingReminder2,
    sendAdminAccessActivated,
    sendAdminAccessExpired,
    sendUserAccessRequestConfirmation,
    sendUserAccessGranted,
    sendUserAccessDenied,
    sendUserAccessPending,
    sendUserAccessExpired,
    sendUserPlatformInvitation,
    sendUserAccessActivatedWelcome,
    sendUserDemoInvitation,
    sendUserShantytownActorInvitation,
    sendAdminWelcome,
    sendUserIdealcoInvitation,
    sendUserFeatures,
    sendUserShare,
    sendUserShantytownActorNotification,
    sendUserNewComment,
    sendAdminContactMessage,
    sendUserCommentDeletion,
    sendUserNewPassword,
    sendUserReview,
} = require('#server/mails/mails');

async function sendMails() {
    const frontUrl = 'https://preprod.resorption-bidonvilles.beta.gouv.fr/#';

    const recipient = {
        first_name: 'Gael',
        last_name: 'Destrem',
        email: 'gael.destrem@gmail.com',
    };
    const adminName = formatName('Admin', 'Doe');
    const inviterName = formatName('Inviter', 'Doe');
    const activationUrl = 'https://activation.example';
    const adminUrl = `${frontUrl}/liste-des-utilisateurs`;
    const activationUrlSentDate = new Date();

    await sendUserReview(recipient);

    await sendAdminAccessActivated(recipient, {
        variables: {
            userName: formatName('John', 'Doe'),
        },
    });
    await sendAdminAccessExpired(recipient, {
        variables: {
            userName: formatName('John', 'Doe'),
            activationUrlSentDate: dateToString(activationUrlSentDate),
            adminUrl,
        },
    });
    await sendAdminContactMessage(recipient, {
        variables: {
            message: {
                created_at: dateToString(new Date()),
                last_name: 'Doe',
                first_name: 'John',
                access_request_message: 'Hey',
            },
        },
    });
    await sendAdminNewRequestNotification(recipient, { variables: { adminUrl } });
    await sendAdminRequestPendingReminder1(recipient, { variables: { adminUrl } });
    await sendAdminRequestPendingReminder2(recipient, { variables: { adminUrl } });
    await sendAdminWelcome(recipient);
    await sendUserDemoInvitation(recipient);
    await sendUserPlatformInvitation(recipient, { variables: { inviterName } });
    await sendUserShantytownActorInvitation(recipient, { variables: { inviterName, shantytown: { id: 'test', addressSimple: 'address', name: 'test' } } });
    await sendUserShantytownActorNotification(recipient, { variables: { inviterName, shantytown: { id: 'test', addressSimple: 'address', name: 'test' } } });

    await sendUserAccessActivatedWelcome(recipient);
    await sendUserAccessDenied(recipient, { variables: { adminName, requestDate: dateToString(new Date()) }, replyTo: recipient });
    await sendUserAccessExpired(recipient);
    await sendUserAccessGranted(recipient, { variables: { adminName, activationUrl, activationUrlExpDate: dateToString(new Date(), true) } });
    await sendUserAccessPending(recipient, { variables: { activationUrl, activationUrlExpDate: dateToString(new Date(), true) } });
    await sendUserAccessRequestConfirmation(recipient);
    await sendUserCommentDeletion(recipient, {
        variables: {
            town: {
                usename: 'a shantytown',
                city: {
                    name: 'city',
                },
            },
            comment: {
                created_at: dateToString(new Date()),
                description: 'original message',
            },
            message: 'reason why message has been deleted',
        },
    });
    await sendUserFeatures(recipient);
    await sendUserIdealcoInvitation(recipient);

    await sendUserNewComment(recipient, {
        variables: {
            shantytown: {
                usename: 'usename',
                addressSimple: 'addressSimple',
                departement: {
                    name: 'departement',
                },
            },
            comment: {
                createdBy: {
                    firstName: 'John',
                    lastName: 'Doe',
                    organization: 'test',
                },
            },
        },
    });
    await sendUserNewPassword(recipient, {
        variables: {
            link: {
                link: 'aresetlink',
                expiracyDate: dateToString(new Date(), true),
            },
        },
    });
    await sendUserShare(recipient);
}

sendMails();
