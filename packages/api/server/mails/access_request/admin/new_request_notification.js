const escape = require('escape-html');
const { toString: dateToString } = require('#server/utils/date');
const signature = require('#server/mails/signature');
const { frontUrl } = require('#server/config');


module.exports = (user) => {
    const date = dateToString(new Date(user.created_at * 1000));

    return {
        Subject: '[Résorption-bidonvilles] - Nouvelle demande d’accès',

        TextPart: `Bonjour,

        Vous avez reçu une demande d’accès à la plateforme Résorption-bidonvilles.
        Pour ouvrir et paramétrer l’accès, rendez-vous sur l’onglet administration de la plateforme à l'adresse suivante : ${frontUrl}/nouvel-utilisateur/${user.id}

        Remarques :
        - Ne jamais ouvrir d’accès si vous avez un doute sur l’identité de la personne
        - Pour valider la demande, cliquez sur “Envoyer un accès”
        - Pour refuser une demande, cliquez sur “Refuser l’accès”, la demande sera conservée dans l’historique. En parallèle, nous vous invitons à envoyer un mail à la personne pour expliquer les motifs de ce refus

        Si vous souhaitez des informations complémentaires sur les droits d’accès à la plateforme, contactez Laure par mail ou téléphone : laure.dubuc@dihal.gouv.fr ou 01 40 81 31 54.

        Il est essentiel qu’une réponse soit apportée rapidement à cette demande (1 semaine maximum).
        Merci.

        -
        ${user.email}
        ${date}

        Objet : Demande d'accès

        ${user.last_name.toUpperCase()} ${user.first_name}
        ${user.organization.name}${user.organization.location[user.organization.location.type] ? `
        ${user.organization.location[user.organization.location.type].name}` : ''}
        ${user.position}

        Message :
        "${user.access_request_message}"
        -

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
                                        Vous avez reçu une demande d’accès à la plateforme <em><a style="color: #000F8C; text-decoration: none;" href="${frontUrl}">Résorption-bidonvilles</em></a>.<br/>
                                        Pour ouvrir et paramétrer l’accès, <a style="color: #000F8C; text-decoration: none;" href="${frontUrl}/nouvel-utilisateur/${user.id}">rendez-vous sur l’onglet administration de la plateforme</a>.<br/>
                                        <br/>
                                        Remarques :<br/>
                                        - Ne jamais ouvrir d’accès si vous avez un doute sur l’identité de la personne<br/>
                                        - Pour valider la demande, cliquez sur “Envoyer un accès”<br/>
                                        - Pour refuser une demande, cliquez sur “Refuser l’accès”, la demande sera conservée dans l’historique. En parallèle, nous vous invitons à envoyer un mail à la personne pour expliquer les motifs de ce refus<br/>
                                        <br/>
                                        Si vous souhaitez des informations complémentaires sur les droits d’accès à la plateforme, contacter Laure par mail ou téléphone : <a style="color: #000F8C; text-decoration: none;" href="mailto:laure.dubuc@dihal.gouv.fr">laure.dubuc@dihal.gouv.fr</a> ou 01 40 81 31 54.<br/>
                                        <br/>
                                        Il est essentiel qu’une réponse soit apportée rapidement à cette demande (1 semaine maximum).<br/>
                                        Merci.<br/>
                                        <br/>
                                    </td>
                                </tr>
                                <tr>
                                <td bgcolor="#dddddd" style="padding: 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td bgcolor="#dddddd"><a style="color: #000F8C; text-decoration: none;" href="mailto:${user.email}">${user.email}</a><br/></td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#dddddd">${date}<br/><br/></td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#dddddd">Objet : Demande d'accès - Demande d'information - Aider<br/><br/></td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#dddddd"><strong>${user.last_name.toUpperCase()} ${user.first_name}</strong><br/></td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#dddddd">${user.organization.name}<br/></td>
                                            </tr>
                                            ${user.organization.location[user.organization.location.type] ? `<tr>
                                                <td bgcolor="#dddddd">${user.organization.location[user.organization.location.type].name}<br/></td>
                                            </tr>` : ''}
                                            <tr>
                                                <td bgcolor="#dddddd">${user.position}<br/><br/></td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#dddddd">Message :<br/>"${escape(user.access_request_message).replace(/\n/g, '<br/>')}"</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#ffffff"><br/><br/></td>
                            </tr>
                            ${signature.HTMLPart}
                            </tbody>
                        </table>
                    </div>
                </body>
            </html>`,
    };
};
