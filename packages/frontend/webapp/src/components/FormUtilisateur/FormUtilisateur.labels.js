export default (variant) => ({
    fr: {
        email: variant === "demande-acces" ? "Votre courriel" : "Courriel",
        verif_email: "Confirmation de votre courriel",
        first_name: "Prénom",
        last_name: "Nom de famille",
        phone: "Téléphone",
        request_type: "Vous souhaitez...",
        is_actor:
            "Faites-vous partie d'une association, d'une collectivité ou d'un service de l'État ?",
        organization_category:
            variant === "demande-acces"
                ? "Quelle structure ?"
                : "Quelle est la structure de l'utilisateur ?",
        organization_type: "Précisez le type de structure",
        organization_public: "Territoire de rattachement",
        territorial_collectivity: "Territoire de la collectivité",
        association: "Nom de l'association",
        new_association_name: "Précisez le nom complet",
        new_association_abbreviation: "Précisez l'acronyme, si applicable",
        departement: "Département de rattachement",
        organization_administration: "Nom de la structure",
        position:
            variant === "demande-acces"
                ? "Votre fonction"
                : "Fonction de l'utilisateur",
        access_request_message: "Votre message",
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
