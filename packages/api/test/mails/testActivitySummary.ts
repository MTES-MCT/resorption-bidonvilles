/* eslint-disable no-console */
import '../../module_alias';
import activityModel from '#server/models/activityModel';
import userModel from '#server/models/userModel';
import mailsUtils from '#server/mails/mails';
import moment from 'moment';
import { User } from '#root/types/resources/User.d';

moment.locale('fr');

const { sendActivitySummary } = mailsUtils;

async function testActivitySummary() {
    const testEmail = process.env.RB_API_TEST_EMAIL;

    if (!testEmail) {
        console.error('Erreur: La variable d\'environnement RB_API_TEST_EMAIL n\'est pas définie');
        console.log('Définissez-la dans votre fichier .env: RB_API_TEST_EMAIL=votre.email@example.com');
        process.exit(1);
    }

    console.log(`Envoi du mail de test à: ${testEmail}`);

    // Utiliser le lundi de la semaine dernière
    const now = moment().subtract(7, 'days');
    const monday = moment(now).day(1).startOf('day').toDate();
    const sunday = moment(monday).add(6, 'days').endOf('day').toDate();

    console.log(`Période du récap: du ${moment(monday).format('DD/MM/YYYY')} au ${moment(sunday).format('DD/MM/YYYY')}`);

    try {
        // Récupérer les données d'activité
        console.log('Récupération des données d\'activité...');
        const [questions, summary, subscribers] = await Promise.all([
            activityModel.getQuestions(monday, sunday),
            activityModel.get(monday, sunday),
            userModel.findDepartementSummarySubscribers(),
        ]);

        console.log(`${questions.length} questions trouvées`);
        console.log(`Données d'activité récupérées pour ${Object.keys(summary).length} régions`);
        console.log(`${subscribers.length} abonnés trouvés`);

        // Trouver un utilisateur abonné pour utiliser ses zones d'intervention
        // ou créer un utilisateur de test avec des zones nationales
        let testUser: User;

        if (subscribers.length > 0) {
            // Utiliser le premier abonné comme modèle
            testUser = { ...subscribers[0] };
            console.log(`Utilisation du profil de: ${testUser.first_name} ${testUser.last_name}`);
        } else {
            console.log('Aucun abonné trouvé, création d\'un utilisateur de test avec accès national');
            testUser = {
                email: testEmail,
                first_name: 'Test',
                last_name: 'User',
                intervention_areas: {
                    is_national: true,
                    areas: [],
                },
            } as User;
        }

        // Remplacer l'email par l'email de test
        testUser.email = testEmail;

        // Calculer les summaries pour cet utilisateur
        let subscribedSummaries = [];
        if (testUser.intervention_areas.is_national) {
            subscribedSummaries = Object.values(summary).reduce((acc, departements) => {
                Object.keys(departements).sort((a, b) => a.localeCompare(b)).forEach((code) => {
                    acc.push(departements[code]);
                });
                return acc;
            }, []);
        } else {
            testUser.intervention_areas.areas.forEach((area) => {
                if (area.type === 'region') {
                    subscribedSummaries.push(...Object.values(summary[area.region.code]));
                } else if (area.departement !== null) {
                    subscribedSummaries.push(summary[area.region.code][area.departement.code]);
                }
            });
        }

        console.log(`${subscribedSummaries.length} départements dans le récap`);

        // Envoyer le mail
        console.log('Envoi du mail...');
        const from = moment(monday);
        const to = moment(sunday);

        await sendActivitySummary(testUser, {
            variables: {
                campaign: `${from.format('DD-MM-YYYY')}`,
                from: from.format('DD'),
                to: to.format('DD MMMM YYYY'),
                questionSummary: questions,
                summaries: subscribedSummaries,
                showDetails: true,
            },
        });

        console.log('Mail envoyé avec succès !');
        console.log(`Mail envoyé à: ${testEmail}`);
    } catch (error) {
        console.error('Erreur lors de l\'envoi du mail:', error);
        process.exit(1);
    }
}

testActivitySummary(); // NOSONAR
