import { sequelize } from '#db/sequelize';
import userModel from '#server/models/userModel/index';
import ServiceError from '#server/errors/ServiceError';
import mails from '#server/mails/mails';
import mattermost from '#server/utils/mattermost';
import getPermission from '#server/utils/permission/getPermission';
import agendaFactory from '#server/loaders/agendaLoader';
import { deactivateUser } from '#server/utils/keycloak/keycloakRolesManagement';
import { User } from '#root/types/resources/User.d';

/**
 * Vérifie que l'utilisateur existe et n'est pas déjà désactivé
 * @param user - Utilisateur à vérifier
 * @returns {Promise<void>}
 */
function checkUser(user: User): void {
    if (!user) {
        throw new Error('Le compte n\'a pas été trouvé en base de données');
    }

    if (user.status === 'inactive') {
        throw new Error('Le compte de cet utilisateur est déjà désactivé');
    }
}

/**
 * Trouve un utilisateur par son ID et valide qu'il existe et n'est pas déjà désactivé
 * @param id - ID de l'utilisateur
 * @returns {Promise<User>}
 */
async function findAndValidateUser(id: number): Promise<User> {
    let user: User;

    try {
        user = await userModel.findOne(id, undefined, null, 'deactivate');
        checkUser(user);
        return user;
    } catch (error) {
        if (error.message.includes('trouvé') || error.message.includes('déjà désactivé')) {
            throw error;
        }
        throw new Error('Une erreur est survenue lors de la lecture en base de données');
    }
}

/**
 * Désactive un utilisateur
 * @param id - ID de l'utilisateur
 * @param anonymizationRequested - Demande d'anonymisation en DB métier
 * @param user - Utilisateur à désactiver
 * @returns {Promise<User>}
 */
async function deactivateUserWithTransaction(id: number, anonymizationRequested: boolean, user: User): Promise<User> {
    const transaction = await sequelize.transaction();

    // Supprime le rôle RB_* de l'utilisateur côté Keycloak
    try {
        await deactivateUser(user.keycloak_id);
    } catch (error) {
        throw new ServiceError('keycloak_user_deactivation_failure', error);
    }

    try {
        const updatedUsers = await userModel.deactivate([id], 'admin', anonymizationRequested, transaction);

        if (updatedUsers?.length !== 1) {
            throw new Error('Erreur de mise à jour');
        }

        const updatedUser: User = { ...user, status: updatedUsers[0].fk_status as User['status'] };

        if (updatedUser.status !== 'inactive') {
            throw new Error('Erreur de mise à jour');
        }

        await transaction.commit();
        return updatedUser;
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError(error.message === 'Erreur de mise à jour' ? 'deactivation_failure' : 'transaction_failure', error);
    }
}

/**
 * Envoie les notifications de désactivation
 * @param user - Utilisateur désactivé
 * @param selfDeactivation - Désactivation par l'utilisateur lui-même
 * @param reason - Raison de la désactivation
 * @returns {Promise<void>}
 */
async function sendNotifications(user: User, selfDeactivation: boolean, reason: string = null): Promise<void> {
    try {
        if (selfDeactivation) {
            await Promise.all([
                mails.sendUserDeactivationConfirmation(user),
                mattermost.triggerNotifyNewUserSelfDeactivation(user),
            ]);
        } else {
            await mails.sendUserDeactivationByAdminAlert(user, {
                variables: {
                    reason: reason || 'Aucune raison mentionnée',
                },
            });
        }
    } catch {
        // DO NOTHING
    }
}

/**
 * Vérifie l'existence d'un job par son nom et l'ID de l'utilisateur, puis l'annule s'il existe
 * @param agenda - Instance Agenda
 * @param jobName - Nom du job à annuler
 * @param userId - ID de l'utilisateur
 * @returns {Promise<void>}
 */
async function checkAndCancelJob(agenda, jobName: string, userId: number): Promise<void> {
    // On recherche le job par son nom et l'identifiant du compte utilisateur
    const jobs = await agenda.jobs({
        name: jobName,
        'data.user.id': userId,
    });

    // On vérifie que le job existe
    if (jobs && jobs.length > 0) {
        // On annule le job
        await agenda.cancel({
            name: jobName,
            'data.user.id': userId,
        });
    }
}

// Ces jobs sont créés par accessActivatedOnboarding
// dès l'activation du compte utilisateur
const onboardingJob = [
    'demo_invitation',
    'entraide_invitation',
    'user_features',
    'user_share',
];

/**
 * Désactive un utilisateur
 * @param id - ID de l'utilisateur
 * @param selfDeactivation - Désactivation par l'utilisateur lui-même
 * @param author - Auteur de la désactivation
 * @param reason - Raison de la désactivation
 * @param anonymizationRequested - Demande d'anonymisation
 * @returns {Promise<User>}
 */
export default async function deactivate(id: number, selfDeactivation: boolean, author: User, reason: string = null, anonymizationRequested: boolean = false): Promise<User> {
    const permission = getPermission(author, 'deactivate', 'user');
    if (!permission) {
        throw new ServiceError('deactivation_permission_failure', new Error('Erreur de permission'));
    }
    let user: User;
    try {
        user = await findAndValidateUser(id);
    } catch (e) {
        throw new ServiceError('user_search_failure', new Error(e.message));
    }
    const updatedUser = await deactivateUserWithTransaction(id, anonymizationRequested, user);

    // Désactivation éventuelle des jobs programmés par accessActivatedOnboarding s'ils sont actifs
    await sendNotifications(updatedUser, selfDeactivation, reason);
    const agenda = agendaFactory();
    await Promise.all(onboardingJob.map(async (jobName) => {
        try {
            await checkAndCancelJob(agenda, jobName, id);
        } catch {
            // DO NOTHING
        }
    }));
    return updatedUser;
}
