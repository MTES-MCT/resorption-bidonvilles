const { frontUrl } = require('#server/config');
const signature = require('../signature');

const demoUrl = 'https://app.evalandgo.com/s/index.php?a=JTk2cCU5N2slOUElQjA=&id=JTk4ayU5QW4lOTYlQUY=';

module.exports = (host, town) => ({
    Subject: '[ resorption-bidonvilles ] - Invitation à rejoindre la communauté',

    TextPart: `Bonjour,

        ${host.first_name} ${host.last_name.toUpperCase()} vous a invité à rejoindre la communauté des acteurs de terrain sur la plateforme Résorption-bidonvilles en valorisant votre intervention sur le site "${town.usename}".

        Qu'est-ce que Résorption-bidonvilles ?
        C'est une plateforme numérique dont l'objectif est d'accélérer la résorption des bidonvilles et faciliter l'insertion des habitants ; un outil collaboratif pour s'informer et agir.

        À qui s'adresse Résorption-bidonvilles ?
        À tous les acteurs de terrain : les services de l'État, les DDCS, les collectivités territoriales, les associations...

        Quels bénéfices pour les utilisateurs ?
        La plateforme vous permet de piloter et de suivre en temps réel la situation et les actions sur votre territoire, de partager vos actions, de contacter les intervenants sur bidonville ou squat. La meilleure circulation de l'information permet aux acteurs d'agir mieux et plus rapidement auprès des habitants.

        Pour rejoindre la communauté des utilisateurs :
        1. demandez un accès via ce formulaire : ${frontUrl}/contact
        2. inscrivez-vous à une démonstration personnalisée de la plateforme (45 min) : ${demoUrl}

        Cordialement,

        ${signature.TextPart}`,

    HTMLPart: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "">
        <html>
            <head>
                <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet">
            </head>

            <body style="max-width: 600px; width: 600px;" bgcolor="#ffffff">
                <div class="container" style="font-family: 'Open Sans'; width: 600px;">
                    <table style="width: 600px; font-family: 'Open Sans'; color: #000000;" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tbody>
                            <tr>
                                <td bgcolor="#ffffff">
                                    Bonjour,<br/>
                                    <br/>
                                    ${host.first_name} ${host.last_name.toUpperCase()} vous a invité à rejoindre la communauté des acteurs de terrain sur la plateforme <em><a style="color: #000F8C; text-decoration: none;" href="${frontUrl}">Résorption-bidonvilles</a></em> en valorisant votre intervention sur le site <a style="color: #000F8C; text-decoration: none;" href="${frontUrl}/site/${town.id}">"${town.usename}"</strong></a>.<br/>
                                    <br/>
                                    <strong>Qu'est-ce que <em><a style="color: #000F8C; text-decoration: none;" href="${frontUrl}">Résorption-bidonvilles</a></em> ?</strong><br/>
                                    C'est une plateforme numérique dont l'objectif est d'accélérer la résorption des bidonvilles et faciliter l'insertion des habitants ; un outil collaboratif pour s'informer et agir.<br/>
                                    <br/>
                                    <strong>À qui s'adresse <em><a style="color: #000F8C; text-decoration: none;" href="${frontUrl}">Résorption-bidonvilles</a></em> ?</strong><br/>
                                    À tous les acteurs de terrain : les services de l'État, les DDCS, les collectivités territoriales, les associations...<br/>
                                    <br/>
                                    <strong>Quels bénéfices pour les utilisateurs ?</strong><br/>
                                    La plateforme vous permet de piloter et de suivre en temps réel la situation et les actions sur votre territoire, de partager vos actions, de contacter les intervenants sur bidonville ou squat. La meilleure circulation de l'information permet aux acteurs d'agir mieux et plus rapidement auprès des habitants.<br/>
                                    <br/>
                                    <strong>Pour rejoindre la communauté des utilisateurs :</strong><br/>
                                    1. demandez un accès via ce formulaire : <a style="color: #000F8C; text-decoration: none;" href="${frontUrl}/contact">${frontUrl}/contact</a><br/>
                                    2. inscrivez-vous à une démonstration personnalisée de la plateforme (45 min) : <a style="color: #000F8C; text-decoration: none;" href="${demoUrl}">${demoUrl}</a><br/>
                                    <br/>
                                    Cordialement,
                                    <br/>
                                    <br/>
                                </td>
                            </tr>
                            ${signature.HTMLPart}
                        </tbody>
                    </table>
                </div>
            </body>
        </html>`,
});
