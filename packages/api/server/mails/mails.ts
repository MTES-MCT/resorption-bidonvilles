import moment from 'moment';
import userModel from '#server/models/userModel';
import mailService from '#server/services/mailService';
import config from '#server/config';

import generateTrackingUTM from './generateTrackingUTM';

const { formatName } = userModel;
const {
    wwwUrl, webappUrl, backUrl, blogUrl,
} = config;

const formationUrl = 'https://app.evalandgo.com/s/index.php?id=JTk5aSU5M2slOTklQUI%3D&a=JTk2cCU5N2slOUElQjA%3D';
const connexionUrl = `${webappUrl}/connexion`;
const contactUrl = `${webappUrl}/contact`;
const adminGuideUrl = `${backUrl}/assets/guide_utilisateur/guide_admin_2020_06.pdf`;
const userGuideUrl = `${backUrl}/assets/guide_utilisateur/guide_utilisateur_2021_02.pdf`;
const invitationUrl = `${webappUrl}/invitation`;
const idealcoUrl = 'https://www.idealco.fr/campagne/?utm_campaign=g-386-3036d540';
const surveyUrl = 'https://app.evalandgo.com/s/index.php?id=JTk4ciU5MXAlOUUlQUU%3D&a=JTk2cCU5N2slOUElQjA%3D';

const ADMIN_CAMPAIGN = 'admin-email';
const REQUESTER_CAMPAIGN = 'demandeur-email';
const USER_CAMPAIGN = 'utilisateur-email';
const INVITE_CAMPAIGN = 'invite-email';
const SUMMARY_CAMPAIGN = 'recap-activite-email';

type MailOptions = {
    preserveRecipient?: boolean,
    variables?: { [key: string]: any },
    replyTo?: {
        email: string,
        first_name: string,
        last_name: string
    }
};

export default {
    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendAdminAccessActivated: (recipient, options: MailOptions = {}) => {
        const { preserveRecipient = false, variables } = options;

        const utm = generateTrackingUTM(ADMIN_CAMPAIGN, 'compte-active');

        return mailService.send('admin_access_activated', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                userName: variables.userName,
                webappUrl: `${webappUrl}?${utm}`,
                formationUrl,
                backUrl,
                blogUrl,
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendAdminAccessExpired: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient = false } = options;

        const utm = generateTrackingUTM(ADMIN_CAMPAIGN, 'compte-non-active');

        return mailService.send('admin_access_expired', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                userName: variables.userName,
                activationUrlSentDate: variables.activationUrlSentDate,
                webappUrl: `${webappUrl}?${utm}`,
                adminUrl: `${variables.adminUrl}?${utm}`,
                connexionUrl: `${variables.adminUrl}?${utm}`,
                backUrl,
                blogUrl,
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendAdminContactMessage: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient = false, replyTo } = options;

        return mailService.send('admin_contact_message', {
            recipient,
            variables: {
                backUrl,
                blogUrl,
                message: variables.message,
            },
            preserveRecipient,
            replyTo,
        });
    },


    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   * @param {Object} options
   */
    sendAdminNewRequestNotification: (recipient, options: MailOptions = {}) => {
        const { preserveRecipient = false, variables } = options;

        const utm = generateTrackingUTM(ADMIN_CAMPAIGN, 'nouvelle-demande-acces');

        return mailService.send('admin_new_request_notification', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                userName: variables.userName,
                orgName: variables.orgName,
                webappUrl: `${webappUrl}?${utm}`,
                adminUrl: `${variables.adminUrl}?${utm}`,
                connexionUrl: `${variables.adminUrl}?${utm}`,
                formationUrl,
                backUrl,
                blogUrl,
            },
            preserveRecipient,
        });
    },
    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   * @param {Object} options
   */
    sendAdminRequestPendingReminder1: (recipient, options: MailOptions = {}) => {
        const { preserveRecipient = false, variables } = options;

        const utm = generateTrackingUTM(
            ADMIN_CAMPAIGN,
            'nouvelle-demande-acces-3j',
        );

        return mailService.send('admin_request_pending_reminder_1', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                userName: variables.userName,
                orgName: variables.orgName,
                webappUrl: `${webappUrl}?${utm}`,
                adminUrl: `${variables.adminUrl}?${utm}`,
                connexionUrl: `${variables.adminUrl}?${utm}`,
                backUrl,
                blogUrl,
            },
            preserveRecipient,
        });
    },
    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   * @param {Object} options
   */
    sendAdminRequestPendingReminder2: (recipient, options: MailOptions = {}) => {
        const { preserveRecipient = false, variables } = options;

        const utm = generateTrackingUTM(
            ADMIN_CAMPAIGN,
            'nouvelle-demande-acces-10j',
        );

        return mailService.send('admin_request_pending_reminder_2', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                userName: variables.userName,
                orgName: variables.orgName,
                webappUrl: `${webappUrl}?${utm}`,
                adminUrl: `${variables.adminUrl}?${utm}`,
                connexionUrl: `${variables.adminUrl}?${utm}`,
                backUrl,
                blogUrl,
            },
            preserveRecipient,
        });
    },


    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendAdminWelcome: (recipient, options: MailOptions = {}) => {
        const { preserveRecipient } = options;

        const utm = generateTrackingUTM(ADMIN_CAMPAIGN, 'bienvenue');

        return mailService.send('admin_welcome', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                connexionUrl: `${connexionUrl}?${utm}`,
                adminGuideUrl,
                backUrl,
                blogUrl,
                webappUrl: `${webappUrl}?${utm}`,
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendUserDemoInvitation: (recipient, options: MailOptions = {}) => {
        const { preserveRecipient } = options;

        const utm = generateTrackingUTM(USER_CAMPAIGN, 'formation-invitation');

        return mailService.send('demo_invitation', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                formationUrl,
                backUrl,
                blogUrl,
                webappUrl: `${webappUrl}?${utm}`,
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendUserPlatformInvitation: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient } = options;

        const utm = generateTrackingUTM(INVITE_CAMPAIGN, 'decouvre-demande-acces');

        return mailService.send('platform_invitation', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                inviterName: variables.inviterName,
                wwwUrl: `${wwwUrl}?${utm}`,
                backUrl,
                blogUrl,
                contactUrl: `${contactUrl}?${utm}`,
                formationUrl,
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendUserShantytownActorInvitation: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient } = options;

        const utm = generateTrackingUTM(INVITE_CAMPAIGN, 'partage-demande-acces');

        return mailService.send('shantytown_actor_invitation', {
            recipient,
            variables: {
                inviterName: variables.inviterName,
                siteUrl: `${webappUrl}/site/${variables.shantytown.id}?${utm}`,
                siteAddress: `${variables.shantytown.addressSimple}${variables.shantytown.name ? ` « ${variables.shantytown.name} »` : ''}`,
                connexionUrl: `${connexionUrl}?${utm}`,
                contactUrl: `${contactUrl}?${utm}`,
                backUrl,
                blogUrl,
                webappUrl: `${webappUrl}?${utm}`,
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendUserShantytownActorNotification: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient } = options;

        const utm = generateTrackingUTM(USER_CAMPAIGN, 'invitation-intervenant');

        return mailService.send('shantytown_actor_notification', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                inviterName: variables.inviterName,
                siteUrl: `${webappUrl}/site/${variables.shantytown.id}?${utm}`,
                actionUrl: `${webappUrl}/site/${variables.shantytown.id}?${utm}&action=new_actor`,
                siteAddress: `${variables.shantytown.addressSimple}${variables.shantytown.name ? ` « ${variables.shantytown.name} »` : ''}`,
                contactUrl,
                backUrl,
                blogUrl,
                webappUrl: `${webappUrl}?${utm}`,
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendUserAccessActivatedWelcome: (recipient, options: MailOptions = {}) => {
        const { preserveRecipient } = options;

        const utm = generateTrackingUTM(USER_CAMPAIGN, 'bienvenue-connexion');

        return mailService.send('user_access_activated_welcome', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                userGuideUrl,
                webappUrl: `${webappUrl}?${utm}`,
                backUrl,
                blogUrl,
                formationUrl,
                connexionUrl: `${connexionUrl}?${utm}`,
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendUserAccessDenied: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient, replyTo } = options;

        const utm = generateTrackingUTM(REQUESTER_CAMPAIGN, 'demande-refusee');

        return mailService.send('user_access_denied', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                adminName: variables.adminName,
                wwwUrl: `${wwwUrl}?${utm}`,
                backUrl,
                blogUrl,
            },
            preserveRecipient,
            replyTo,
        });
    },


    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendUserAccessExpired: (recipient, options: MailOptions = {}) => {
        const { preserveRecipient } = options;

        const utm = generateTrackingUTM(REQUESTER_CAMPAIGN, 'demande-expiree');

        return mailService.send('user_access_expired', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                wwwUrl: `${wwwUrl}?${utm}`,
                backUrl,
                blogUrl,
                formationUrl,
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendUserAccessGranted: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient } = options;

        const utm = generateTrackingUTM(REQUESTER_CAMPAIGN, 'activer-mon-compte');

        return mailService.send('user_access_granted', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                adminName: variables.adminName,
                wwwUrl: `${wwwUrl}?${utm}`,
                backUrl,
                blogUrl,
                formationUrl,
                activationUrl: `${variables.activationUrl}?${utm}`,
                activationUrlExpDate: variables.activationUrlExpDate,
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendUserAccessPending: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient } = options;

        const utm = generateTrackingUTM(
            REQUESTER_CAMPAIGN,
            'activer-mon-compte-48h',
        );

        return mailService.send('user_access_pending', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                activationUrl: `${variables.activationUrl}?${utm}`,
                activationUrlExpDate: variables.activationUrlExpDate,
                formationUrl,
                wwwUrl: `${wwwUrl}?${utm}`,
                backUrl,
                blogUrl,
            },
            preserveRecipient,
        });
    },


    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   * @param {Object} options
   */
    sendUserAccessRequestConfirmation: (recipient, options: MailOptions = {}) => {
        const { preserveRecipient } = options;

        const utm = generateTrackingUTM(
            REQUESTER_CAMPAIGN,
            'accuse-demande',
        );

        return mailService.send('user_access_request_confirmation', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                wwwUrl: `${wwwUrl}?${utm}`,
                backUrl,
                blogUrl,
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendUserCommentDeletion: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient } = options;

        return mailService.send('user_comment_deletion', {
            recipient,
            variables: {
                town: variables.town,
                comment: variables.comment,
                message: variables.message,
                backUrl,
                blogUrl,
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendUserFeatures: (recipient, options: MailOptions = {}) => {
        const { preserveRecipient } = options;

        const utm = generateTrackingUTM(USER_CAMPAIGN, '4S-connexion');

        return mailService.send('user_features', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                connexionUrl: `${connexionUrl}?${utm}`,
                backUrl,
                blogUrl,
                webappUrl: `${webappUrl}?${utm}`,
            },
            preserveRecipient,
        });
    },

    /**
   * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
   * @param {Object} options
   */
    sendUserIdealcoInvitation: (recipient, options: MailOptions = {}) => {
        const { preserveRecipient } = options;

        const utm = generateTrackingUTM(USER_CAMPAIGN, '3S-idealco');

        return mailService.send('user_idealco_invitation', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                idealcoUrl,
                backUrl,
                blogUrl,
                webappUrl: `${webappUrl}?${utm}`,
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendUserNewComment: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient = false } = options;

        const utm = generateTrackingUTM(USER_CAMPAIGN, 'nouveau-commentaire');

        // on formatte les tags
        const tags = variables.comment.tags.map(tag => tag.label);
        const tags_length = variables.comment.tags.length;

        let tag_text = '';
        if (tags_length > 0) {
            tag_text = variables.comment.tags.length > 1 ? 'ces étiquettes' : 'cette étiquette';
        }

        return mailService.send('user_new_comment', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                backUrl,
                blogUrl,
                wwwUrl: `${wwwUrl}?${utm}`,
                shantytown: variables.shantytown,
                createdBy: {
                    name: formatName(variables.comment.createdBy),
                    organization: variables.comment.createdBy.organization,
                },
                comment: variables.comment.description,
                tags,
                tags_length,
                tag_text,
                rootAnnuaireUrl: `${webappUrl}/annuaire?${utm}`,
                annuaireUrl: `${webappUrl}/annuaire/${variables.comment.createdBy.organization_id}?${utm}`,
                messageUrl: `${webappUrl}/site/${variables.shantytown.id}#newComment`,
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendUserNewPlanComment: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient = false } = options;

        const utm = generateTrackingUTM(USER_CAMPAIGN, 'nouveau-commentaire-action');

        return mailService.send('user_new_plan_comment', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                backUrl,
                wwwUrl: `${wwwUrl}?${utm}`,
                plan: variables.plan,
                createdBy: {
                    name: formatName(variables.comment.createdBy),
                    organization: variables.comment.createdBy.organization,
                },
                comment: variables.comment.description,
                rootAnnuaireUrl: `${webappUrl}/annuaire?${utm}`,
                annuaireUrl: `${webappUrl}/annuaire/${variables.comment.createdBy.organization_id}?${utm}`,
                planUrl: `${webappUrl}/action/${variables.plan.id}`,
                messageUrl: `${webappUrl}/action/${variables.plan.id}#comment`,
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendUserNewPassword: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient } = options;

        return mailService.send('user_new_password', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                backUrl,
                blogUrl,
                link: variables.link,
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendUserReview: (recipient, options: MailOptions = {}) => {
        const { preserveRecipient } = options;
        const utm = generateTrackingUTM(USER_CAMPAIGN, '12S-votre-avis');

        return mailService.send('user_review', {
            recipient,
            variables: {
                surveyUrl,
                backUrl,
                blogUrl,
                webappUrl: `${webappUrl}?${utm}`,
                connexionUrl: `${connexionUrl}?${utm}`,
                recipientName: formatName(recipient),
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendUserShantytownDeclared: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient } = options;
        const utm = {
            regular: generateTrackingUTM(USER_CAMPAIGN, `dep${variables.departement.code}-nouveau-site`),
            connexion: generateTrackingUTM(USER_CAMPAIGN, `dep${variables.departement.code}-nouveau-site-connexion`),
        };

        return mailService.send('user_shantytown_declared', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                departementName: variables.departement.name,
                hour: moment(variables.shantytown.createdAt).utcOffset(2).format('HH:mm'),
                creatorName: formatName(variables.creator),
                townFullAddress: variables.shantytown.address,
                webappUrl: `${webappUrl}?${utm.regular}`,
                connexionUrl: `${connexionUrl}?${utm.connexion}`,
                townUrl: `${webappUrl}/site/${variables.shantytown.id}?${utm.regular}`,
                blogUrl,
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendUserShantytownClosed: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient } = options;
        const utm = {
            regular: generateTrackingUTM(USER_CAMPAIGN, `dep${variables.departement.code}-site-ferme`),
            connexion: generateTrackingUTM(USER_CAMPAIGN, `dep${variables.departement.code}-site-ferme-connexion`),
        };

        return mailService.send('user_shantytown_closed', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                departementName: variables.departement.name,
                hour: moment(variables.shantytown.closedAt).utcOffset(2).format('HH:mm'),
                editorName: formatName(variables.editor),
                townFullAddress: variables.shantytown.address,
                webappUrl: `${webappUrl}?${utm.regular}`,
                connexionUrl: `${connexionUrl}?${utm.connexion}`,
                townUrl: `${webappUrl}/site/${variables.shantytown.id}?${utm.regular}`,
                blogUrl,
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient  Recipient of the email (must includes first_name, last_name, email)
     * @param {Object} options
     */
    sendUserShare: (recipient, options: MailOptions = {}) => {
        const { preserveRecipient } = options;

        const utm = generateTrackingUTM(USER_CAMPAIGN, '8S-partage-plateforme');

        return mailService.send('user_share', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                invitationUrl: `${invitationUrl}?email=${encodeURIComponent(recipient.email)}&first_name=${encodeURIComponent(recipient.first_name)}&last_name=${encodeURIComponent(recipient.last_name)}&from=push_mail&${utm}`,
                backUrl,
                blogUrl,
                webappUrl: `${webappUrl}?${utm}`,
            },
            preserveRecipient,
        });
    },

    /**
     * @param {User} recipient
     * @param {Object} options
     */
    sendContactNewsletterRegistration(recipient, options: MailOptions = {}) {
        const { variables, preserveRecipient, replyTo } = options;

        return mailService.send('contact_newsletter_registration', {
            recipient,
            variables: {
                email: variables.email,
                backUrl,
                blogUrl,
            },
            preserveRecipient,
            replyTo,
        });
    },

    sendActivitySummary(recipient, options: MailOptions = {}) {
        const { variables, preserveRecipient = false } = options;

        const utm = generateTrackingUTM(SUMMARY_CAMPAIGN, variables.campaign);
        return mailService.send('activity_summary', {
            recipient,
            variables: {
                title: variables.title ? `${variables.title}, ` : '',
                from: variables.from,
                to: variables.to,
                recipientName: formatName(recipient),
                connexionUrl: `${connexionUrl}?${utm}`,
                showDetails: variables.showDetails || false,
                summaries: variables.summaries,
                wwwUrl,
                webappUrl,
                utm,
                blogUrl,
            },
            preserveRecipient,
        });
    },
};
