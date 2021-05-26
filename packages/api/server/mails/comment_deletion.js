const validator = require('validator');
const signature = require('./signature');
const { generateUserSignature } = require('#server/utils/mail');
const { fromTsToFormat } = require('#server/utils/date');

module.exports = (town, comment, message, administrator) => {
    const adminSignature = generateUserSignature(administrator);

    return {
        Subject: '[ resorption-bidonvilles ] - Un de vos commentaires a été supprimé',

        TextPart: `Bonjour,

        Votre commentaire ci-dessous a été supprimé par un administrateur.

        La raison mentionnée par celui-ci est :
        "${message}".

        "${comment.description}"
        Écrit le ${fromTsToFormat(comment.createdAt, 'd/m/Y')} à ${fromTsToFormat(comment.createdAt, 'h:i')}, concernant le site : ${town.usename}, ${town.city.name}

        Pour rappel, conformément à la réglementation relative aux données à caractère personnel, un commentaire doit :
        - être neutre et factuel ;
        - ne pas collecter des données personnelles (nom, condamnation judiciaire...) de personnes ou groupes, porter une attention particulière aux personnes habitant ou issues d'un bidonville ;
        - ne doit pas être subjectif, insultant ou inapproprié

        Merci de votre compréhension,
        Cordialement,

        ${adminSignature.TextPart}
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
                                    Votre commentaire ci-dessous a été supprimé par un administrateur.<br/>
                                    La raison mentionnée par celui-ci est :<br/>
                                    "${validator.escape(message).replace('\n', '<br/>')}".<br/>
                                    <br/>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#ffffff" style="border: 1px solid #ccc; padding: 15px 20px;">
                                    ${fromTsToFormat(comment.createdAt, 'd/m/Y')} à ${fromTsToFormat(comment.createdAt, 'h:i')}<br/>
                                    <font style="font-style: italic; font-weight: bold; color: red;"><b>Commentaire supprimé</b></font><br/>
                                    <font style="font-style: italic; font-weight: bold; color: #ADB9C9;"><b>Site : ${town.usename}, ${town.city.name}</b></font><br/><br/>
                                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td style="border-top: 1px dotted #ADB9C9; padding-top: 10px">${validator.escape(comment.description).replace('\n', '<br/>')}<br/></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#ffffff">
                                    <br/>
                                    Pour rappel, conformément à la réglementation relative aux données à caractère personnel, un commentaire doit :<br/>
                                    - être neutre et factuel ;<br/>
                                    - ne pas collecter des données personnelles (nom, condamnation judiciaire...) de personnes ou groupes, porter une attention particulière aux personnes habitant ou issues d'un bidonville ;<br/>
                                    - ne doit pas être subjectif, insultant ou inapproprié<br/>
                                    <br/>
                                    Merci de votre compréhension,<br/>
                                    Cordialement,<br/>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#ffffff">
                                    <br/>
                                    <br/>
                                    ${adminSignature.HTMLPart}
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
    };
};
