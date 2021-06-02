const { backUrl } = require('#server/config');

module.exports = {
    TextPart: `Résorption-bidonvilles
    Agir pour résorber les bidonvilles
    contact@resorption-bidonvilles.gouv.fr

    Développé par la Dihal`,

    HTMLPart: `<td bgcolor="#ffffff">
        <img src="${backUrl}/assets/mails/marianne.png" width="40" height="15"
            style="width: 40px; height: 15px; margin-bottom: 8pt;" /><br />
        <span
            style=" font-weight: bold; font-size: 10pt; color: #1C1C1A;">Résorption-bidonvilles</span><br />
        <span style="font-size: 10pt; color: #1C1C1A;">Agir pour résorber les bidonvilles</span><br />
        <a href="mailto:contact@resorption-bidonvilles.beta.gouv.fr"
            style="color: #000F8C; text-decoration: none; font-size: 10pt;">contact@resorption-bidonvilles.beta.gouv.fr</a><br />
        <br />
        <span style="font-size: 8pt; color: #1C1C1A;">Développé par la <a
                href="https://www.gouvernement.fr/resorption-des-bidonvilles"
                style="color: #000F8C; text-decoration: none;">Dihal</a></span>
    </td>`,
};
