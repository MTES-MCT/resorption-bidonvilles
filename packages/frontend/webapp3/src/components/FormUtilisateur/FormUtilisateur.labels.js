export default (variant) => ({
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
    territorial_collectivity: "Territoire de rattachement",
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
    referral: "Comment avez-vous connu la plateforme Résorption-bidonvilles ?",
    referral_other:
        "Pouvez-vous préciser comment vous avez connu la plateforme ?",
    referral_word_of_mouth: "Qui vous a recommandé la plateforme ?",
    legal:
        variant === "demande-acces"
            ? "Je certifie que ces données personnelles ont été saisies avec mon accord"
            : "Je certifie que ces données personnelles ont été saisies avec l'accord de leur propriétaire",
});
