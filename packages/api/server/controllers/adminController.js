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
} = require('#server/mails/mails');

module.exports = () => ({
    async updateUser(req, res, next) {
        try {
            const recipient = { first_name: 'Gael', last_name: 'Destrem', email: 'gael.destrem@gmail.com' };
            const userName = 'John Doe';
            const adminName = 'Admin Doe';
            const inviterName = 'Inviter Doe';
            const activationUrl = 'https://activation.example';
            const activationUrlSentDate = new Date();

            await sendAdminNewRequestNotification(recipient);
            await sendAdminRequestPendingReminder1(recipient);
            await sendAdminRequestPendingReminder2(recipient);
            await sendAdminAccessActivated(recipient, userName);
            await sendAdminAccessExpired(recipient, userName, activationUrlSentDate);
            await sendUserAccessRequestConfirmation(recipient);
            await sendUserAccessGranted(recipient, adminName, activationUrl);
            await sendUserAccessDenied(recipient, adminName, activationUrlSentDate);
            await sendUserAccessPending(recipient, activationUrl);
            await sendUserAccessExpired(recipient);
            await sendUserPlatformInvitation(recipient, inviterName);
            await sendUserDemoInvitation(recipient);
            await sendUserAccessActivatedWelcome(recipient);
            await sendUserShantytownActorInvitation(recipient, inviterName);
            await sendAdminWelcome(recipient);
            await sendUserIdealcoInvitation(recipient);
            await sendUserFeatures(recipient);
            await sendUserShare(recipient);


            return res.status(200).send();
        } catch (err) {
            console.log(err);
            res.status(500).send();
            return next(err);
        }
    },
});
