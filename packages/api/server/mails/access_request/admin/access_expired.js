const { toString: dateToString } = require('#server/utils/date');
const signature = require('#server/mails/signature');
const { frontUrl } = require('#server/config');

module.exports = (user, submitDate) => ({
    Subject: '[Résorption-bidonvilles] - Une personne n’a pas activé son accès',

    TextPart: `Bonjour,

    Vous avez ouvert un accès à la plateforme Résorption-bidonvilles à ${user.first_name} ${user.last_name.toUpperCase()} (${user.organization.name}) le ${dateToString(submitDate, false)}. Cette personne n’a pas activé son accès dans le délai des 7 jours suivant l’envoi du lien d’activation. 

    Nous vous invitons à prendre contact avec elle pour comprendre la raison de cette non-activation et si nécessaire, lui envoyer un nouveau lien depuis l’onglet administration de la plateforme à l'adresse suivante : ${frontUrl}/nouvel-utilisateur/${user.id}

    Merci.

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
                                    Vous avez ouvert un accès à la plateforme <em><a style="color: #000F8C; text-decoration: none;" href="${frontUrl}">Résorption-bidonvilles</a></em> à ${user.first_name} ${user.last_name.toUpperCase()} (${user.organization.name}) le ${dateToString(submitDate, false)}. Cette personne n’a pas activé son accès dans le délai des 7 jours suivant l’envoi du lien d’activation.<br/>
                                    <br/>
                                    Nous vous invitons à prendre contact avec elle pour comprendre la raison de cette non-activation et si nécessaire, lui envoyer un nouveau lien depuis <a style="color: #000F8C; text-decoration: none;" href="${frontUrl}/nouvel-utilisateur/${user.id}">l’onglet administration de la plateforme</a>.<br/>
                                    <br/>
                                    Merci.<br/>
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
