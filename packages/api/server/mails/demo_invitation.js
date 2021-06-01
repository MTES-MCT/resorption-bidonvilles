const signature = require('#server/mails/signature');

module.exports = () => ({
    Subject: '[Résorption-bidonvilles] - Participer à une démonstration personnalisée',

    TextPart: `Bonjour,

    Vous avez récemment créé votre compte sur Résorption-bidonvilles.

    Vous souhaitez une démonstration personnalisée ? Vous avez des questions sur son utilisation ? Inscrivez-vous dès maintenant à une session de présentation (durée 45 minutes) : 

    https://app.evalandgo.com/s/index.php?a=JTk2cCU5N2slOUElQjA=&id=JTk4ayU5QW4lOTYlQUY=

    Si vous souhaitez avoir plus d’informations avant de vous inscrire, n’hésitez pas à contacter Laure Dubuc par mail ou téléphone : laure.dubuc@dihal.gouv.fr ou 01 40 81 31 54

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
                                    Vous avez récemment créé votre compte sur Résorption-bidonvilles.
                                    <br/>
                                    Vous souhaitez une démonstration personnalisée ? Vous avez des questions sur son utilisation ? Inscrivez-vous dès maintenant à une session de présentation (durée 45 minutes) : 
                                </td>
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
                                                    <a href="https://app.evalandgo.com/s/index.php?a=JTk2cCU5N2slOUElQjA=&id=JTk4ayU5QW4lOTYlQUY=" target="_blank" style="16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-weight:normal; text-align:center; background-color: #000091; text-decoration: none; border: none; -webkit-border-radius: 0px; -moz-border-radius: 0px; border-radius: 0px; display: inline-block;">
                                                        <span style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-weight:normal; line-height:1.5em; text-align:center;">S'inscrire à une session de présentation</span>
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
                            <tr>
                                <td bgcolor="#ffffff">
                                    Si vous souhaitez avoir plus d’informations avant de vous inscrire, n’hésitez pas à contacter Laure Dubuc par mail ou téléphone : laure.dubuc@dihal.gouv.fr ou 01 40 81 31 54. 
                                    <br/>
                                    Cordialement,
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
