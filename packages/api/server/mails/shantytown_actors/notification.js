const { frontUrl } = require('#server/config');
const signature = require('../signature');

module.exports = (host, town) => ({
    Subject: '[ resorption-bidonvilles ] - Vous avez reçu une invitation',

    TextPart: `Bonjour,

        ${host.first_name} ${host.last_name.toUpperCase()} vous a invité en tant qu'intervenant sur le site "${town.usename}".
        Ainsi, vous recevrez en temps réel les informations urgentes et messages transmis par les autres acteurs du site.

        Quels sont vos champs d'intervention sur ce site ? Connectez-vous à Résorption-bidonvilles à l'adresse ci-après pour les renseigner et ainsi faciliter la coordination entre tous les acteurs sur ce site :
        ${frontUrl}/site/${town.id}

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
                                    ${host.first_name} ${host.last_name.toUpperCase()} vous a invité en tant qu'<strong>intervenant sur le site <a style="color: #000F8C; text-decoration: none;" href="${frontUrl}/site/${town.id}#intervenants">"${town.usename}"</strong></a>.<br/>
                                    Ainsi, vous recevrez en temps réel les informations urgentes et messages transmis par les autres acteurs du site.<br/><br/>
                                    Quels sont vos champs d'intervention sur ce site ? Connectez-vous à <em><a style="color: #000F8C; text-decoration: none;" href="${frontUrl}/site/${town.id}#intervenants">Résorption-bidonvilles</a></em> pour les renseigner et ainsi faciliter la coordination entre tous les acteurs sur ce site.<br/>
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
