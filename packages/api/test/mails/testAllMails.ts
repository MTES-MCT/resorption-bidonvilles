/* eslint-disable no-console */
import '../../module_alias';
import fs from 'node:fs';
import path from 'node:path';
import mails from '#server/mails/mails';
import config from '#server/config';

const DELAY_BETWEEN_SENDS_MS = 2000;

// Ajouter une entrée ici pour couvrir un nouveau mail.
const MAILS_TO_TEST: string[] = [
    'sendActionAlertPostshot',
    'sendActionAlertPreshot',
    'sendActivitySummary',
    'sendAdminAccessActivated',
    'sendAdminAccessExpired',
    'sendAdminCommentDeletion',
    'sendAdminContactMessage',
    'sendAdminNewRequestNotification',
    'sendAdminRequestPendingReminder1',
    'sendAdminRequestPendingReminder2',
    'sendAdminTownReporting',
    'sendAdminWelcome',
    'sendConfirmationOfTownReporting',
    'sendContactNewsletterRegistration',
    'sendInactiveUserAlert',
    'sendInactiveUserDeactivationAlert',
    'sendParcelOwner',
    'sendUserAccessActivatedWelcome',
    'sendUserAccessDenied',
    'sendUserAccessExpired',
    'sendUserAccessGranted',
    'sendUserAccessPending',
    'sendUserAccessRequestConfirmation',
    'sendUserCommentDeletion',
    'sendUserDeactivationByAdminAlert',
    'sendUserDeactivationConfirmation',
    'sendUserDemoInvitation',
    'sendUserFeatures',
    'sendUserNewActionComment',
    'sendUserNewComment',
    'sendUserNewPassword',
    'sendUserPlatformInvitation',
    'sendUserReactivationAlert',
    'sendUserReview',
    'sendUserShantytownActorInvitation',
    'sendUserShantytownActorNotification',
    'sendUserShantytownClosed',
    'sendUserShantytownDeclared',
    'sendUserShare',
];

const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const loadFixture = (mailName: string): { recipient: object, options: object } => {
    const fixturePath = path.join(__dirname, 'fixtures', `${mailName}.json`);
    const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
    fixture.recipient.email = config.testEmail;
    return fixture;
};

async function testAllMails() {
    if (!config.testEmail) {
        console.error('Erreur: La variable d\'environnement RB_API_TEST_EMAIL n\'est pas définie');
        process.exit(1);
    }

    console.log(`Envoi de ${MAILS_TO_TEST.length} mail(s) de test à: ${config.testEmail}\n`);

    for (let i = 0; i < MAILS_TO_TEST.length; i += 1) {
        const mailName = MAILS_TO_TEST[i];

        try {
            const { recipient, options } = loadFixture(mailName);
            console.log(`[${i + 1}/${MAILS_TO_TEST.length}] Envoi de "${mailName}"...`);
            // Envoi volontairement séquentiel pour espacer les requêtes Brevo et faciliter la relecture des mails reçus.
            // eslint-disable-next-line no-await-in-loop, import/namespace
            await mails[mailName](recipient, options);
            console.log(`[${i + 1}/${MAILS_TO_TEST.length}] "${mailName}" envoyé avec succès`);
        } catch (error) {
            console.error(`[${i + 1}/${MAILS_TO_TEST.length}] Échec de l'envoi de "${mailName}":`, error);
        }

        if (i < MAILS_TO_TEST.length - 1) {
            // eslint-disable-next-line no-await-in-loop
            await wait(DELAY_BETWEEN_SENDS_MS);
        }
    }

    console.log('\nTerminé. Vérifiez la boîte de réception pour contrôler le rendu de chaque mail.');
}

testAllMails(); // NOSONAR
