const signature = require('#server/mails/signature');
const { frontUrl } = require('#server/config');

module.exports = user => ({
    Subject: '[Résorption-bidonvilles] - Une personne a activé son accès',

    TextPart: `Bonjour,

    ${user.first_name} ${user.last_name.toUpperCase()} (${user.organization.name}) a activé son accès à la plateforme Résorption-bidonvilles aujourd’hui.

    À présent, cette personne fait partie de la communauté des utilisateurs de la plateforme d’information, de partage et de pilotage des acteurs de la résorption des bidonvilles. N’hésitez pas à l’accompagner dans la prise en main de l’outil ou à inciter son utilisation.

    Nous sommes également à votre disposition pour organiser un temps d’échange avec les utilisateurs de votre territoire. Contactez Laure : laure.dubuc@dihal.gouv.fr ou 01 40 81 31 54.

    Cordialement.

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
                                    ${user.first_name} ${user.last_name.toUpperCase()} (${user.organization.name}) a activé son accès à la plateforme <em><a style="color: #000F8C; text-decoration: none;" href="${frontUrl}">Résorption-bidonvilles</a></em> aujourd'hui.<br/>
                                    <br/>
                                    À présent, cette personne fait partie de la communauté des utilisateurs de la plateforme d’information, de partage et de pilotage des acteurs de la résorption des bidonvilles. N’hésitez pas à l’accompagner dans la prise en main de l’outil ou à inciter son utilisation.<br/>
                                    <br/>
                                    Nous sommes également à votre disposition pour organiser un temps d’échange avec les utilisateurs de votre territoire. Contacter Laure : <a style="color: #000F8C; text-decoration: none;" href="mailto:laure.dubuc@dihal.gouv.fr">laure.dubuc@dihal.gouv.fr</a> ou 01 40 81 31 54.<br/>
                                    <br/>
                                    Cordialement.
                                    <br/>
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
