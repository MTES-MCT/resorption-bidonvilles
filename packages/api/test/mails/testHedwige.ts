/* eslint-disable no-console */
import '../../module_alias';
import config from '#server/config';
import { assertHedwigeConfigured, sendHedwigeMail } from './hedwigeClient';

const testEmail = config.testEmail || '';

if (!testEmail) {
    console.error('Erreur: La variable d\'environnement RB_API_TEST_EMAIL n\'est pas définie');
    process.exit(1);
}

assertHedwigeConfigured();

sendHedwigeMail(
    testEmail,
    'Test POC Hedwige',
    '<p>Ceci est un test envoyé via <strong>Hedwige</strong>.</p>',
    'Ceci est un test envoyé via Hedwige.',
)
    .then(() => console.log('OK'))
    .catch(err => console.error('KO', err.response?.data || err.message));
