const signature = require('#server/mails/signature');
const { backUrl, frontUrl } = require('#server/config');

module.exports = () => ({
    Subject: '[Résorption-bidonvilles] - Bienvenue sur Résorption-Bidonvilles',

    TextPart: `Bonjour,

    Bienvenue ! Nous sommes heureux de vous compter parmi les utilisateurs de Résorption-bidonvilles.

    Afin de vous accompagner dans l'utilisation de la plateforme, vous trouverez ci-dessous le guide de l'utilisateur.

    Télécharger le guide de l'utilisateur: ${backUrl}/assets/guide_utilisateur/guide_utilisateur_2021_02.pdf

    Se connecter à la plateforme: ${frontUrl}/connexion

    La plateforme est vivante grâce à ses utilisateurs, faites-la connaître à vos partenaires :

    Partager sur Facebook: https://www.facebook.com/sharer/sharer.php?u=${frontUrl}/contact

    Partager sur Twitter: http://www.twitter.com/share?url=${frontUrl}/contact
        
    Nous contacter par mail: contact@resorption-bidonvilles.beta.gouv.fr

   Cordialement, 
      
    ${signature.TextPart}`,

    HTMLPart: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "">
    <html>
    <head>
        <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.2/css/all.css" integrity="sha384-vSIIfh2YWi9wW0r9iZe7RJPrKwp6bG+s9QZMoITbCckVJqGCCRhc+ccxNcdpHuYu" crossorigin="anonymous">
        <script src="https://kit.fontawesome.com/a34dd7c713.js" crossorigin="anonymous"></script>
    </head>

    <body style="max-width: 600px; width: 600px;" bgcolor="#ffffff">
        <div class="container" style="font-family: 'Open Sans'; width: 600px;">
            <table style="width: 600px; font-family: 'Open Sans'; color: #000000;" border="0" cellpadding="0" cellspacing="0" width="600">
                <tbody>
                    <tr>
                        <td bgcolor="#ffffff">
                            Bonjour,<br/>
                            <br/>
                            Bienvenue ! Nous sommes heureux de vous compter parmi les utilisateurs de <em><a style="color: #000F8C; text-decoration: none;" href="${frontUrl}">Résorption-bidonvilles</a></em>.
                            <br/>
                            Afin de vous accompagner dans l'utilisation de la plateforme, vous trouverez ci-dessous le guide de l'utilisateur. 
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
                                                    <a href="${backUrl}/assets/guide_utilisateur/guide_utilisateur_2021_02.pdf" target="_blank" style="16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-weight:normal; text-align:center; background-color: #000091; text-decoration: none; border: none; -webkit-border-radius: 0px; -moz-border-radius: 0px; border-radius: 0px; display: inline-block;">
                                                        <span style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-weight:normal; line-height:1.5em; text-align:center;">Télécharger le guide de l'utilisateur</span>
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
                        <td bgcolor="#ffffff" align="center">
                            <table align="center" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                    <td align="center" style="padding: 10px;">
                                        <table border="0" class="mobile-button" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="center" bgcolor="#000091" style="background-color: #000091; margin: auto; max-width: 600px; -webkit-border-radius: 0px; -moz-border-radius: 0px; border-radius: 0px; padding: 15px 20px; " width="100%">
                                                <!--[if mso]>&nbsp;<![endif]-->
                                                    <a href="${frontUrl}/connexion" target="_blank" style="16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-weight:normal; text-align:center; background-color: #000091; text-decoration: none; border: none; -webkit-border-radius: 0px; -moz-border-radius: 0px; border-radius: 0px; display: inline-block;">
                                                        <span style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-weight:normal; line-height:1.5em; text-align:center;">Se connecter à la plateforme</span>
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
                            La plateforme est vivante grâce à ses utilisateurs, faites-la connaître à vos partenaires :<br/>
                            <br/>
                            <a style="text-decoration: none" href="https://www.facebook.com/sharer/sharer.php?u=${frontUrl}/contact" id="profile-link"><svg width="30" height="30" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-square" class="svg-inline--fa fa-facebook-square fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z"></path></svg></a>                                    
                            <a style="text-decoration: none" href="http://www.twitter.com/share?url=${frontUrl}/contact" id="profile-link"><svg width="30" height="30" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter-square" class="svg-inline--fa fa-twitter-square fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-48.9 158.8c.2 2.8.2 5.7.2 8.5 0 86.7-66 186.6-186.6 186.6-37.2 0-71.7-10.8-100.7-29.4 5.3.6 10.4.8 15.8.8 30.7 0 58.9-10.4 81.4-28-28.8-.6-53-19.5-61.3-45.5 10.1 1.5 19.2 1.5 29.6-1.2-30-6.1-52.5-32.5-52.5-64.4v-.8c8.7 4.9 18.9 7.9 29.6 8.3a65.447 65.447 0 0 1-29.2-54.6c0-12.2 3.2-23.4 8.9-33.1 32.3 39.8 80.8 65.8 135.2 68.6-9.3-44.5 24-80.6 64-80.6 18.9 0 35.9 7.9 47.9 20.7 14.8-2.8 29-8.3 41.6-15.8-4.9 15.2-15.2 28-28.8 36.1 13.2-1.4 26-5.1 37.8-10.2-8.9 13.1-20.1 24.7-32.9 34z"></path></svg></a>
                            <a style="text-decoration: none" href="mailto:contact@resorption-bidonvilles.beta.gouv.fr" id="profile-link"><svg width="30" height="30" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="envelope-square" class="svg-inline--fa fa-envelope-square fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M400 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM178.117 262.104C87.429 196.287 88.353 196.121 64 177.167V152c0-13.255 10.745-24 24-24h272c13.255 0 24 10.745 24 24v25.167c-24.371 18.969-23.434 19.124-114.117 84.938-10.5 7.655-31.392 26.12-45.883 25.894-14.503.218-35.367-18.227-45.883-25.895zM384 217.775V360c0 13.255-10.745 24-24 24H88c-13.255 0-24-10.745-24-24V217.775c13.958 10.794 33.329 25.236 95.303 70.214 14.162 10.341 37.975 32.145 64.694 32.01 26.887.134 51.037-22.041 64.72-32.025 61.958-44.965 81.325-59.406 95.283-70.199z"></path></svg></a>                            <br/><br/>
                            Cordialement.<br/>
                            <br/>
                        </td>
                    </tr>
                    <tr>
                        ${signature.HTMLPart}
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
    </html>`,
});
