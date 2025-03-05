import moment from 'moment';
import userModel from '#server/models/userModel';
import mailService from '#server/services/mailService';
import config from '#server/config';

import { QuestionSummary } from '#server/models/activityModel/types/QuestionNationalSummary';
import formatDate from '#server/utils/formatDate';
import generateTrackingUTM from './generateTrackingUTM';

const { formatName } = userModel;
const {
    wwwUrl, webappUrl, backUrl, blogUrl,
} = config;

const formationUrl = 'https://framaforms.org/sinscrire-a-une-session-de-prise-en-main-resorption-bidonvilles-1702635472';
const connexionUrl = `${webappUrl}/connexion`;
const contactUrl = `${webappUrl}/contact`;
const adminGuideUrl = `${backUrl}/assets/guide_utilisateur/guide_admin_2020_06.pdf`;
const userGuideUrl = `${backUrl}/assets/guide_utilisateur/guide_utilisateur_2021_02.pdf`;
const invitationUrl = `${webappUrl}/invitation`;
const surveyUrl = 'https://app.evalandgo.com/s/index.php?id=JTk4ciU5MXAlOUUlQUU%3D&a=JTk2cCU5N2slOUElQjA%3D';

const ACTION_CAMPAIGN = 'action-email';
const ADMIN_CAMPAIGN = 'admin-email';
const REQUESTER_CAMPAIGN = 'demandeur-email';
const USER_CAMPAIGN = 'utilisateur-email';
const INVITE_CAMPAIGN = 'invite-email';
const SUMMARY_CAMPAIGN = 'recap-activite-email';
const COMMUNITY_CAMPAIGN = 'community-email';

type MailOptions = {
    preserveRecipient?: boolean,
    variables?: { [key: string]: any },
    replyTo?: {
        email: string,
        first_name: string,
        last_name: string
    },
    bcc?: {
        email: string,
        first_name: string,
        last_name: string
    }[]
};

export default {
    sendActionAlertPostshot(recipient, options: MailOptions = {}) {
        const { preserveRecipient = false, variables } = options;

        const utm = generateTrackingUTM(ACTION_CAMPAIGN, 'postshot');

        return mailService.send('action_alert_postshot', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                actions: variables.actions,
                actions_length: variables.actions.length,
                webappUrl: `${webappUrl}`,
                backUrl,
                blogUrl,
                utm,
            },
            preserveRecipient,
        });
    },

    sendActionAlertPreshot(recipient, options: MailOptions = {}) {
        const { preserveRecipient = false, variables } = options;

        const utm = generateTrackingUTM(ACTION_CAMPAIGN, 'preshot');
        return mailService.send('action_alert_preshot', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                actions: variables.actions,
                actions_length: variables.actions.length,
                webappUrl: `${webappUrl}`,
                backUrl,
                blogUrl,
                utm,
            },
            preserveRecipient,
        });
    },

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

    sendAnswerDeletionNotification(recipient, options: MailOptions = {}) {
        const { variables, preserveRecipient = false } = options;
        const utm = generateTrackingUTM(COMMUNITY_CAMPAIGN, 'reponse-moderee');

        return mailService.send('answer_deletion_notification', {
            recipient,
            variables: {
                message: variables.message,
                created_at: variables.created_at,
                question: variables.question,
                reason: variables.reason,
                utm,
                webappUrl,
                backUrl,
                blogUrl,
            },
            preserveRecipient,
        });
    },

    sendCommunityNewAnswerForAuthor: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient = false } = options;
        const utm = generateTrackingUTM(COMMUNITY_CAMPAIGN, 'nouvelle-reponse');

        return mailService.send('community_new_answer_for_author', {
            recipient,
            variables: {
                questionId: variables.questionId,
                authorName: formatName(variables.author),
                authorOrganization: variables.author.organization.id,
                webappUrl,
                utm,
                backUrl,
                blogUrl,
            },
            preserveRecipient,
        });
    },

    sendCommunityNewAnswerForObservers: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient = false } = options;
        const utm = generateTrackingUTM(COMMUNITY_CAMPAIGN, 'nouvelle-reponse');

        return mailService.send('community_new_answer_for_observers', {
            recipient,
            variables: {
                questionId: variables.questionId,
                authorName: formatName(variables.author),
                authorOrganization: variables.author.organization.id,
                question: variables.question,
                webappUrl,
                utm,
                backUrl,
                blogUrl,
            },
            preserveRecipient,
        });
    },

    sendCommunityNewQuestion: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient } = options;

        const utm = generateTrackingUTM(COMMUNITY_CAMPAIGN, 'nouvelle-question');

        return mailService.send('community_new_question', {
            recipient,
            variables: {
                backUrl,
                blogUrl,
                webappUrl,
                utm,
                created_by: `${formatName(variables.question.createdBy)} (${variables.question.createdBy.organization.name})`,
                question: variables.question.question,
                questionId: variables.question.id,
            },
            preserveRecipient,
        });
    },

    sendInactiveUserAlert: (recipient, options: MailOptions = {}) => {
        const { preserveRecipient = false } = options;

        const utm = generateTrackingUTM(USER_CAMPAIGN, 'inactivity-alert');

        return mailService.send('inactive_user_alert', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                backUrl,
                blogUrl,
                webappUrl: `${webappUrl}?${utm}`,
            },
            preserveRecipient,
        });
    },

    sendInactiveUserDeactivationAlert: (recipient, options: MailOptions = {}) => {
        const { preserveRecipient = false } = options;

        return mailService.send('inactive_user_deactivation_alert', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
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
        const { variables, preserveRecipient, bcc } = options;

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
            bcc,
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

    sendUserDeactivationConfirmation: (recipient, options: MailOptions = {}) => {
        const { preserveRecipient = false } = options;
        const utm = generateTrackingUTM(USER_CAMPAIGN, 'auto-desactivation');

        return mailService.send('user_deactivation_confirmation', {
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

    sendUserDeactivationByAdminAlert: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient = false } = options;
        const utm = generateTrackingUTM(USER_CAMPAIGN, 'desactivation-par-admin');

        return mailService.send('user_deactivation_by_admin_alert', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                reason: variables.reason,
                connexionUrl: `${connexionUrl}?${utm}`,
                backUrl,
                blogUrl,
                webappUrl: `${webappUrl}?${utm}`,
            },
            preserveRecipient,
        });
    },

    sendUserReactivationAlert: (recipient, options: MailOptions = {}) => {
        const { preserveRecipient = false } = options;
        const utm = generateTrackingUTM(USER_CAMPAIGN, 'reactivation-par-admin');

        return mailService.send('user_reactivation_alert', {
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

    sendUserEntraideInvitation: (recipient, options: MailOptions = {}) => {
        const { preserveRecipient } = options;

        const utm = generateTrackingUTM(USER_CAMPAIGN, '3S-entraide');

        return mailService.send('user_entraide_invitation', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                entraideUrl: `${webappUrl}?${utm}`,
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
                webappUrl,
                utm,
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
    sendUserNewActionComment: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient = false } = options;

        const utm = generateTrackingUTM(USER_CAMPAIGN, 'nouveau-commentaire-action');

        return mailService.send('user_new_action_comment', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                backUrl,
                blogUrl,
                webappUrl,
                utm,
                wwwUrl: `${wwwUrl}?${utm}`,
                action: variables.action,
                createdBy: {
                    name: formatName(variables.comment.createdBy),
                    organization: variables.comment.createdBy.organization,
                },
                comment: variables.comment.description,
                rootAnnuaireUrl: `${webappUrl}/annuaire?${utm}`,
                annuaireUrl: `${webappUrl}/annuaire/${variables.comment.createdBy.organization_id}?${utm}`,
                actionUrl: `${webappUrl}/action/${variables.action.id}`,
                messageUrl: `${webappUrl}/action/${variables.action.id}#comment`,
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

        const title = () => `${variables.shantytown.usename} ${variables.shantytown.city.name} (${variables.shantytown.departement.code})`;

        return mailService.send('user_shantytown_declared', {
            recipient,
            variables: {
                recipientName: formatName(recipient),
                departementName: variables.departement.name,
                hour: formatDate(variables.shantytown.createdAt, 'd M y à h:i'),
                creatorName: formatName(variables.creator),
                townAddress: variables.shantytown.address,
                title: title(),
                webappUrl,
                utm: utm.regular,
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
                webappUrl,
                utm: utm.regular,
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
        interface SortedQuestions {
            questions_without_answers: QuestionSummary[],
            questions_with_answers: QuestionSummary[],
        }

        const sortedQuestions: SortedQuestions = (variables?.questionSummary || []).reduce((acc, question: QuestionSummary) => {
            if (question.number_of_recent_answers > 0) {
                acc.questions_with_answers.push(question);
            } else {
                acc.questions_without_answers.push(question);
            }

            return acc;
        }, {
            questions_without_answers: [],
            questions_with_answers: [],
        } as SortedQuestions);

        const utm = generateTrackingUTM(SUMMARY_CAMPAIGN, variables.campaign);
        return mailService.send('activity_summary', {
            recipient,
            variables: {
                from: variables.from,
                to: variables.to,
                recipientName: formatName(recipient),
                connexionUrl: `${connexionUrl}?${utm}`,
                showDetails: variables.showDetails || false,
                summaries: variables.summaries,
                show_question_summary: sortedQuestions.questions_with_answers.length > 0 || sortedQuestions.questions_without_answers.length > 0,
                questions_with_answers_length: sortedQuestions.questions_with_answers.length,
                questions_with_answers: sortedQuestions.questions_with_answers,
                questions_without_answers_length: sortedQuestions.questions_without_answers.length,
                questions_without_answers: sortedQuestions.questions_without_answers,
                backUrl,
                wwwUrl,
                webappUrl,
                utm,
                blogUrl,
            },
            preserveRecipient,
        });
    },
    sendConfirmationOfTownReporting: (recipient, options: MailOptions = {}) => {
        const { preserveRecipient = false } = options;

        return mailService.send('user_shantytown_reporting', {
            recipient,
            variables: {
                webappUrl,
                backUrl,
                blogUrl,
            },
            preserveRecipient,
        });
    },
    sendAdminTownReporting: (recipient, options: MailOptions = {}) => {
        const { variables, preserveRecipient = false } = options;

        return mailService.send('admin_shantytown_reporting', {
            recipient,
            variables: {
                town: variables.town,
                creatorName: formatName(variables.creator),
                creatorOrganization: variables.creator.organization.name,
                creatorEmail: variables.creator.email,
                creatorId: variables.creator.id,
                townFormUrl: `${webappUrl}/site/nouveau`,
                webappUrl,
                backUrl,
                blogUrl,
            },
            preserveRecipient,
            replyTo: {
                email: variables.creator.email,
                first_name: variables.creator.first_name,
                last_name: variables.creator.last_name,
            },
        });
    },
};
