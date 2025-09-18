export default (variant) => ({
    fr: {
        email: variant === "demande-acces" ? "Votre courriel" : "Courriel",
        aria_email:
            "Veuillez saisir l'adresse de messagerie à laquelle vous recontacter et qui vous servira d'identifiant",
        verif_email: "Confirmation de votre courriel",
        first_name: "Prénom",
        last_name: "Nom de famille",
        phone: "Téléphone",
        request_type: "Vous souhaitez...",
        organization_category:
            variant === "demande-acces"
                ? "Quelle structure ?"
                : "Quelle est la structure de l'utilisateur ?",
        organization_type: "Précisez la structure",
        organization_public: "Territoire de rattachement",
        territorial_collectivity: "Territoire de la collectivité",
        association: "Nom de l'association",
        organization_administration: "Nom de la structure",
        private_organization: "Nom de l'organisme privé",
        organization_other: "Précisez le nom de votre structure",
        organization_other_acronyme: "Précisez l'acronyme de votre structure",
        organization_other_territory:
            "Précisez le territoire de votre structure",
        position:
            variant === "demande-acces"
                ? "Votre fonction"
                : "Fonction de l'utilisateur",
        access_request_message:
            "Expliquez-nous pourquoi vous voulez accéder à notre plate-forme",
        referral:
            "Comment avez-vous connu la plateforme Résorption-bidonvilles ?",
        referral_other:
            "Pouvez-vous préciser comment vous avez connu la plateforme ?",
        referral_word_of_mouth: "Qui vous a recommandé la plateforme ?",
        legal:
            variant === "demande-acces"
                ? "Je certifie que ces données personnelles ont été saisies avec mon accord"
                : "Je certifie que ces données personnelles ont été saisies avec l'accord de leur propriétaire",
    },
    en: {
        email: "Your email",
        aria_email:
            "Please enter the email address at which you can be contacted",
        verif_email: "Confirm your email",
        first_name: "First name",
        last_name: "Last Name",
        phone: "Phone number",
        request_type: "You want to...",
        access_request_message: "Your message",
        referral:
            "How did you hear about the Résorption-bidonvilles platform ?",
        referral_other: "Can you specify how you found out about the platform?",
        referral_word_of_mouth: "Who recommended the platform to you ?",
        legal: "I certify that this personal data has been entered with my consent",
    },
    ro: {
        email: "E-mailul dumneavoastră",
        aria_email:
            "Vă rugăm să introduceți adresa de e-mail pentru a vă contacta și care va servi drept identificator",
        verif_email: "confirmati emailul dumneavoastra",
        first_name: "Prenume",
        last_name: "Nume",
        phone: "Număr de telefon",
        request_type: "Doriţi",
        access_request_message: "Mesajul dumneavoastră",
        referral: "Cum ai auzit de platforma Résorbtion-bidonvilles ?",
        referral_other: "Puteți specifica cum ați aflat despre platformă ?",
        referral_word_of_mouth: "Cine ți-a recomandat platforma ?",
        legal: "Certific faptul că aceste date cu caracter personal au fost introduse cu consimțământul meu.",
    },
    bg: {
        email: "твоят имейл",
        aria_email:
            "Моля, въведете имейл адреса за връзка с вас и който ще служи като ваш идентификатор",
        verif_email: "потвърдете своя имейл",
        first_name: "Име",
        last_name: "Фамилия",
        phone: "Телефонен номер",
        request_type: "Желаете да...",
        access_request_message: "Вашето съобщение",
        referral: "Как научихте за платформата Résorption-bidonvilles ?",
        referral_other: "Можете ли да посочите как разбрахте за платформата?",
        referral_word_of_mouth: "Кой ви препоръча платформата ?",
        legal: "Декларирам, че личните ми данни са въведени с мое съгласие.",
    },
});
