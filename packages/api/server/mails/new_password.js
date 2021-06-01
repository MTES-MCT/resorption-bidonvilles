const { toString: dateToString } = require('#server/utils/date');
const signature = require('./signature');

module.exports = (user, link) => ({
    Subject: '[ resorption-bidonvilles ] - Nouveau mot de passe',

    TextPart: `Bonjour,

    Une demande de renouvellement du mot de passe associé à votre accès Résorption Bidonvilles a été formulée.
    Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce mail.

    Si vous souhaitez renouveler votre mot de passe, veuillez vous rendre à l'adresse suivante avant le ${dateToString(link.expiracyDate, true)}
    ${link.link}

    Cordialement,

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
                                Une demande de renouvellement du mot de passe associé à votre accès Résorption Bidonvilles a été formulée.<br/>
                                Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce mail.<br/>
                                <br/>
                                Si vous souhaitez renouveler votre mot de passe, veuillez cliquer sur le lien suivant avant le ${dateToString(link.expiracyDate, true)} :<br/>
                                <a href="${link.link}">renouveler mon mot de passe</a><br/>
                                <br/>
                                Cordialement,<br/>
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
