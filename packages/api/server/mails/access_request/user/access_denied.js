const { toString: dateToString } = require('#server/utils/date');
const signature = require('#server/mails/signature');
const { frontUrl } = require('#server/config');

module.exports = (activatedUser, administrator) => ({
    Subject: '[Résorption-bidonvilles] - Votre demande d’accès',

    TextPart: `Bonjour,

    Vous avez effectué une demande d’accès à la plateforme Résorption-bidonvilles le ${dateToString(new Date(activatedUser.created_at * 1000))}.
    L'administrateur local de votre territoire, ${administrator.first_name} ${administrator.last_name.toUpperCase()} (${administrator.organization.name}) n'a pas donné suite à votre demande.

    Vous pouvez le contacter par retour de ce mail pour de plus amples informations.

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
                                Vous avez effectué une demande d’accès à la plateforme <em><a style="color: #000F8C; text-decoration: none;" href="${frontUrl}">Résorption-bidonvilles</a></em> le ${dateToString(new Date(activatedUser.created_at * 1000))}.<br/>
                                L'administrateur local de votre territoire, ${administrator.first_name} ${administrator.last_name.toUpperCase()} (${administrator.organization.name}) n'a pas donné suite à votre demande.<br/>
                                <br/>
                                Vous pouvez le contacter par retour de ce mail pour de plus amples informations.<br/>
                                <br/>
                                Cordialement.<br/>
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
