const {
    send: sendMail,
} = require('#server/services/mailService');
const { frontUrl } = require('#server/config');


const generateTrackingUTM = require('./generateTrackingUTM');

const formationUrl = 'https://app.evalandgo.com/s/index.php?a=JTk2cCU5N2slOUElQjA=&id=JTk4ayU5QW4lOTYlQUY=';
const connexionUrl = `${frontUrl}/#/connexion`;
const contactUrl = `${frontUrl}/#/contact`;
// Redirect from logged to admin doesnt preserve utm
const adminUrl = `${frontUrl}/#/connexion`;
const guideAdminUrl = `${frontUrl}/#/connexion`;
const invitationURL = '';
const idealcoUrl = 'https://www.idealco.fr/campagne/?utm_campaign=g-386-3036d540';

const ADMIN_CAMPAIGN = 'admin-email';
const REQUESTER_CAMPAIGN = 'demandeur-email';
const USER_CAMPAIGN = 'utilisateur-email';
const INVITE_CAMPAIGN = 'invite-email';

const backUrl = 'https://api.preprod.resorption-bidonvilles.beta.gouv.fr';


module.exports = {
    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   */
    sendAdminNewRequestNotification: (recipient) => {
        const utm = generateTrackingUTM(ADMIN_CAMPAIGN, 'nouvelle-demande-acces');

        return sendMail('admin_new_request_notification', {
            recipient,
            variables: {
                recipientName: `${recipient.first_name} ${recipient.last_name}`,
                frontUrl: `${frontUrl}?${utm}`,
                adminUrl: `${adminUrl}?${utm}`,
                connexionUrl: `${adminUrl}?${utm}`,
                formationUrl,
                backUrl,
            },
        });
    },
    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   */
    sendAdminRequestPendingReminder1: (recipient) => {
        const utm = generateTrackingUTM(ADMIN_CAMPAIGN, 'nouvelle-demande-acces-3j');

        return sendMail('admin_request_pending_reminder_1', {
            recipient,
            variables: {
                recipientName: `${recipient.first_name} ${recipient.last_name}`,
                frontUrl: `${frontUrl}?${utm}`,
                adminUrl: `${adminUrl}?${utm}`,
                connexionUrl: `${adminUrl}?${utm}`,
                backUrl,
            },
        });
    },
    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   */
    sendAdminRequestPendingReminder2: (recipient) => {
        const utm = generateTrackingUTM(ADMIN_CAMPAIGN, 'nouvelle-demande-acces-10j');

        return sendMail('admin_request_pending_reminder_2', {
            recipient,
            variables: {
                recipientName: `${recipient.first_name} ${recipient.last_name}`,
                frontUrl: `${frontUrl}?${utm}`,
                adminUrl: `${adminUrl}?${utm}`,
                connexionUrl: `${adminUrl}?${utm}`,
                backUrl,
            },
        });
    },
    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   * @param {String} userName
   */
    sendAdminAccessActivated: (recipient, userName) => {
        const utm = generateTrackingUTM(ADMIN_CAMPAIGN, 'acces-active');

        return sendMail('admin_access_activated', {
            recipient,
            variables: {
                recipientName: `${recipient.first_name} ${recipient.last_name}`,
                userName,
                frontUrl: `${frontUrl}?${utm}`,
                connexionUrl: `${adminUrl}?${utm}`,
                formationUrl,
                backUrl,
            },
        });
    },
    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   * @param {String} userName
   * @param {Date} activationUrlSentDate
   */
    sendAdminAccessExpired: (recipient, userName, activationUrlSentDate) => {
        const utm = generateTrackingUTM(ADMIN_CAMPAIGN, 'acces-expire');

        return sendMail('admin_access_expired', {
            recipient,
            variables: {
                recipientName: `${recipient.first_name} ${recipient.last_name}`,
                userName,
                activationUrlSentDate: activationUrlSentDate.toDateString(),
                frontUrl: `${frontUrl}?${utm}`,
                adminUrl: `${adminUrl}?${utm}`,
                backUrl,
            },
        });
    },
    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   */
    sendUserAccessRequestConfirmation: (recipient) => {
        const utm = generateTrackingUTM(REQUESTER_CAMPAIGN, 'confirmation-demande-acces');

        return sendMail('user_access_request_confirmation', {
            recipient,
            variables: {
                recipientName: `${recipient.first_name} ${recipient.last_name}`,
                frontUrl: `${frontUrl}?${utm}`,
                backUrl,
            },
        });
    },
    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   * @param {String} adminName
   * @param {String} activationUrl
   */
    sendUserAccessGranted: (recipient, adminName, activationUrl) => {
        const utm = generateTrackingUTM(REQUESTER_CAMPAIGN, 'activer-mon-compte');

        return sendMail('user_access_granted', {
            recipient,
            variables: {
                recipientName: `${recipient.first_name} ${recipient.last_name}`,
                adminName,
                frontUrl: `${frontUrl}?${utm}`,
                backUrl,
                formationUrl,
                activationUrl,
            },
        });
    },

    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   * @param {String} adminName
   * @param {String} activationUrlSentDate
   */
    sendUserAccessDenied: (recipient, adminName, activationUrlSentDate) => {
        const utm = generateTrackingUTM(REQUESTER_CAMPAIGN, 'acces-refuse');

        return sendMail('user_access_denied', {
            recipient,
            variables: {
                recipientName: `${recipient.first_name} ${recipient.last_name}`,
                adminName,
                frontUrl: `${frontUrl}?${utm}`,
                backUrl,
                activationUrlSentDate: activationUrlSentDate.toDateString(),
            },
        });
    },

    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   * @param {String} activationUrl
   */
    sendUserAccessPending: (recipient, activationUrl) => {
        const utm = generateTrackingUTM(REQUESTER_CAMPAIGN, 'activer-mon-compte-48h');

        return sendMail('user_access_pending', {
            recipient,
            variables: {
                recipientName: `${recipient.first_name} ${recipient.last_name}`,
                activationUrl,
                frontUrl: `${frontUrl}?${utm}`,
                backUrl,
            },
        });
    },

    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   */
    sendUserAccessExpired: (recipient) => {
        const utm = generateTrackingUTM(REQUESTER_CAMPAIGN, 'nouvelle-demande-acces');

        return sendMail('user_access_expired', {
            recipient,
            variables: {
                recipientName: `${recipient.first_name} ${recipient.last_name}`,
                frontUrl: `${frontUrl}?${utm}`,
                backUrl,
                formationUrl,
            },
        });
    },

    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   */
    sendUserAccessActivatedWelcome: (recipient) => {
        const utm = generateTrackingUTM(USER_CAMPAIGN, 'acces-active');

        return sendMail('user_access_activated_welcome', {
            recipient,
            variables: {
                recipientName: `${recipient.first_name} ${recipient.last_name}`,
                frontUrl: `${frontUrl}?${utm}`,
                backUrl,
                formationUrl,
                connexionUrl,
            },
        });
    },

    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   * @param {String} inviterName
   */
    sendUserPlatformInvitation: (recipient, inviterName) => {
        const utm = generateTrackingUTM(INVITE_CAMPAIGN, 'invitation-plateforme');

        return sendMail('platform_invitation', {
            recipient,
            variables: {
                recipientName: `${recipient.first_name} ${recipient.last_name}`,
                inviterName,
                frontUrl: `${frontUrl}?${utm}`,
                backUrl,
                contactUrl,
                formationUrl,
            },
        });
    },


    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   */
    sendUserDemoInvitation: (recipient) => {
        const utm = generateTrackingUTM(INVITE_CAMPAIGN, 'demo-invitation');

        return sendMail('demo_invitation', {
            recipient,
            variables: {
                recipientName: `${recipient.first_name} ${recipient.last_name}`,
                formationUrl,
                backUrl,
                frontURL: `${frontUrl}?${utm}`,
            },
        });
    },

    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   * @param {String} inviterName
   */
    sendUserShantytownActorInvitation: (recipient, inviterName) => {
        const utm = generateTrackingUTM(USER_CAMPAIGN, 'invitation-intervenant');

        return sendMail('shantytown_actor_invitation', {
            recipient,
            variables: {
                recipientName: `${recipient.first_name} ${recipient.last_name}`,
                inviterName,
                connexionUrl,
                contactUrl,
                backUrl,
                frontURL: `${frontUrl}?${utm}`,
            },
        });
    },

    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   */
    sendAdminWelcome: (recipient) => {
        const utm = generateTrackingUTM(ADMIN_CAMPAIGN, 'bienvenue');

        return sendMail('admin_welcome', {
            recipient,
            variables: {
                recipientName: `${recipient.first_name} ${recipient.last_name}`,
                connexionUrl,
                guideAdminUrl,
                backUrl,
                frontURL: `${frontUrl}?${utm}`,
            },
        });
    },

    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   */
    sendUserIdealcoInvitation: (recipient) => {
        const utm = generateTrackingUTM(INVITE_CAMPAIGN, 'invitation-idealco');

        return sendMail('user_idealco_invitation', {
            recipient,
            variables: {
                recipientName: `${recipient.first_name} ${recipient.last_name}`,
                idealcoUrl,
                backUrl,
                frontURL: `${frontUrl}?${utm}`,
            },
        });
    },

    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   */
    sendUserFeatures: (recipient) => {
        const utm = generateTrackingUTM(USER_CAMPAIGN, 'features');

        return sendMail('user_features', {
            recipient,
            variables: {
                recipientName: `${recipient.first_name} ${recipient.last_name}`,
                connexionUrl,
                backUrl,
                frontURL: `${frontUrl}?${utm}`,
            },
        });
    },

    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   */
    sendUserShare: (recipient) => {
        const utm = generateTrackingUTM(USER_CAMPAIGN, 'partage-plateforme');

        return sendMail('user_share', {
            recipient,
            variables: {
                recipientName: `${recipient.first_name} ${recipient.last_name}`,
                connexionUrl,
                invitationURL,
                backUrl,
                frontURL: `${frontUrl}?${utm}`,
            },
        });
    },


};
