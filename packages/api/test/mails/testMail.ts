/* eslint-disable no-console */
import '../../module_alias';
import mailsUtils from '#server/utils/mail';
import config from '#server/config';

const testEmail = config.testEmail || '';

if (!testEmail) {
    console.error('Erreur: La variable d\'environnement RB_API_TEST_EMAIL n\'est pas définie');
    console.log('Définissez-la dans votre fichier .env: RB_API_TEST_EMAIL=votre.email@example.com');
    process.exit(1);
}

mailsUtils.send(
    {
        email: testEmail,
        first_name: 'Test',
        last_name: 'Brevo',
    },
    {
        Subject: 'Test migration Brevo',
        HTMLPart: '<p>Ceci est un test.</p>',
        TextPart: 'Ceci est un test.',
    },

).then(res => console.log('OK', res)).catch(err => console.error('KO', err));
