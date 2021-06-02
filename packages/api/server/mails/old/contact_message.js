const escape = require('escape-html');
const { toString: dateToString } = require('#server/utils/date');
const signature = require('./signature');


module.exports = (message, date) => ({
    Subject: '[ resorption-bidonvilles ] - Vous avez reçu un nouveau message de contact',

    TextPart: `Cher administrateur,

        Vous avez reçu un nouveau message de contact
        
        Merci,

        -
        Date du message : ${dateToString(date)}

        ${message.last_name.toUpperCase()} ${message.first_name}
        ${message.access_request_message}
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
                                    Cher administrateur,<br/>
                                    <br/>
                                    Vous avez reçu un nouveau message de contact<br/>
                                    <br/>
                                    Merci,<br/>
                                    <br/>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#dddddd" style="padding: 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td bgcolor="#dddddd">Date du message : ${dateToString(date)}<br/><br/></td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#dddddd">${message.last_name.toUpperCase()} ${message.first_name}<br/></td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#dddddd">${escape(message.access_request_message).replace(/\n/g, '<br/>')}</td>
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
});
