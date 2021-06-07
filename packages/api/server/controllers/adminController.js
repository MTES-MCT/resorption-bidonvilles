const { toString: dateToString } = require('#server/utils/date');

const {
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

module.exports = () => ({
    async updateUser(req, res, next) {
        try {
            const recipient = {
                first_name: 'Gael',
                last_name: 'Destrem',
                email: 'gael.destrem@gmail.com',
            };
            const userName = 'John Doe';
            const adminName = 'Admin Doe';
            const inviterName = 'Inviter Doe';
            const activationUrl = 'https://activation.example';
            const activationUrlSentDate = new Date();

            await sendUserReview(recipient);

            await sendAdminAccessActivated(recipient, {
                variables: {
                    userName,
                },
            });
            await sendAdminAccessExpired(recipient, {
                variables: {
                    userName,
                    activationUrlSentDate: dateToString(activationUrlSentDate),
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
            await sendAdminNewRequestNotification(recipient);
            await sendAdminRequestPendingReminder1(recipient);
            await sendAdminRequestPendingReminder2(recipient);
            await sendAdminWelcome(recipient);
            await sendUserDemoInvitation(recipient);
            await sendUserPlatformInvitation(recipient, { variables: { inviterName } });
            await sendUserShantytownActorInvitation(recipient, { variables: { inviterName, shantytown: { id: 'test', address: 'test' } } });
            await sendUserShantytownActorNotification(recipient, { variables: { inviterName, shantytown: { id: 'test', address: 'test' } } });
            await sendUserAccessActivatedWelcome(recipient);
            await sendUserAccessDenied(recipient, { variables: { adminName, requestDate: dateToString(new Date()) } });
            await sendUserAccessExpired(recipient);
            await sendUserAccessGranted(recipient, { variables: { adminName, activationUrl, activationUrlExpDate: dateToString(new Date()) } });
            await sendUserAccessPending(recipient, { variables: { activationUrl } });
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

            return res.status(200).send();
        } catch (err) {
            console.log(err);
            res.status(500).send();
            return next(err);
        }
    },
});
