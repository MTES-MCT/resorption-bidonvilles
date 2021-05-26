const escape = require('escape-html');
const { toString: dateToString } = require('#server/utils/date');
const signature = require('#server/mails/signature');

module.exports = (user) => {
    const date = dateToString(new Date(user.created_at * 1000));

    return {
        Subject: '[Résorption-bidonvilles] - Nous vous répondrons rapidement',

        TextPart: `Bonjour,

        Merci de votre message, nous vous répondrons prochainement.
        Cordialement.

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
                                    Merci de votre message, nous vous répondrons prochainement.<br/>
                                    Cordialement.<br/>
                                    <br/>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#dddddd" style="padding: 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td bgcolor="#dddddd">${user.email}<br/></td>
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
