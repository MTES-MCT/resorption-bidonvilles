const PUBLIC_LABELS = {
    shantytown: "Tous les acteurs du site",
    action: "Tous les utilisateurs ayant accès aux commentaires de l'action",
};

export function getCommentModes(context = "shantytown") {
    return [
        { uid: "public", label: PUBLIC_LABELS[context] },
        {
            uid: "pref_et_ddets",
            label: "Les acteurs en préfecture et DDETS uniquement",
        },
        { uid: "custom", label: "Une liste d'acteurs personnalisée" },
    ];
}

export default getCommentModes("shantytown");
