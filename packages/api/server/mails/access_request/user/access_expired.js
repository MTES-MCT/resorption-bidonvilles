const { toString: dateToString } = require('#server/utils/date');
const signature = require('#server/mails/signature');
const { frontUrl } = require('#server/config');

module.exports = expiracyDate => ({
    Subject: '[Résorption-bidonvilles] - Votre lien d’accès est expiré',

    TextPart: `Bonjour,

    Votre lien d'accès à la plateforme Résorption-bidonvilles est expiré depuis le ${dateToString(expiracyDate, true)}. Cet outil d'information, de partage et de pilotage permet de créer une véritable dynamique collaborative entre les acteurs d'un territoire.

    Vous souhaitez une démonstration personnalisée de la plateforme ? Vous avez des questions sur son utilisation ? Vous souhaitez recevoir un nouveau lien d’accès ? N'hésitez pas à contacter Laure par mail ou téléphone : laure.dubuc@dihal.gouv.fr ou 01 40 81 31 54.

    Pour nous contacter : ${frontUrl}/contact

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
                                    Votre lien d'accès à la plateforme <em><a style="color: #000F8C; text-decoration: none;" href="${frontUrl}">Résorption-bidonvilles</a></em> est expiré depuis le ${dateToString(expiracyDate, true)}. Cet outil d'information, de partage et de pilotage permet de créer une véritable dynamique collaborative entre les acteurs d'un territoire.<br/>
                                    <br/>
                                    Vous souhaitez une démonstration personnalisée de la plateforme ? Vous avez des questions sur son utilisation ? Vous souhaitez recevoir un nouveau lien d’accès ? N’hésitez pas à contacter Laure par mail ou téléphone : <a style="color: #000F8C; text-decoration: none;" href="mailto:laure.dubuc@dihal.gouv.fr">laure.dubuc@dihal.gouv.fr</a> ou 01 40 81 31 54.<br/>
                                    <br/>
                                    Cordialement.<br/>
                                    <br/>
                                </tr>
                            </tr>
                            <tr>
                                <td bgcolor="#ffffff" align="center">
                                    <table align="center" cellspacing="0" cellpadding="0" width="100%">
                                        <tr>
                                            <td align="center" style="padding: 10px;">
                                            <table border="0" class="mobile-button" cellspacing="0" cellpadding="0">
                                                <tr>
                                                <td align="center" bgcolor="#000091" style="background-color: #000091; margin: auto; max-width: 600px; -webkit-border-radius: 0px; -moz-border-radius: 0px; border-radius: 0px; padding: 15px 20px; " width="100%">
                                                <!--[if mso]>&nbsp;<![endif]-->
                                                    <a href="${frontUrl}/contact" target="_blank" style="16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-weight:normal; text-align:center; background-color: #000091; text-decoration: none; border: none; -webkit-border-radius: 0px; -moz-border-radius: 0px; border-radius: 0px; display: inline-block;">
                                                        <span style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-weight:normal; line-height:1.5em; text-align:center;">Nous contacter</span>
                                                    </a>
                                                <!--[if mso]>&nbsp;<![endif]-->
                                                </td>
                                                </tr>
                                            </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            ${signature.HTMLPart}
                        </tbody>
                    </table>
                </div>
            </body>
        </html>`,
});
