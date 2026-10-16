// Motif d'un placeholder envsubst non substitué (ex : "${VITE_ENV_LABEL}")
const UNSUBSTITUTED_PLACEHOLDER = /^\$\{[^}]*\}$/;

/**
 * Normalise la valeur brute de VITE_ENV_LABEL.
 * Renvoie une chaîne vide (= production, aucun marquage) si la valeur est
 * absente, vide, composée d'espaces ou si c'est un placeholder non substitué.
 */
export function normalizeEnvLabel(rawValue) {
    if (typeof rawValue !== "string") {
        return "";
    }

    const value = rawValue.trim();
    const lowerCased = value.toLowerCase();
    if (
        value === "" ||
        lowerCased === "undefined" ||
        lowerCased === "null" ||
        UNSUBSTITUTED_PLACEHOLDER.test(value)
    ) {
        return "";
    }

    return value;
}

/**
 * Ajoute le préfixe "[LABEL] " au titre de la page si un label est défini.
 * Sans label, le titre est renvoyé tel quel.
 */
export function prefixTitleWithLabel(title, label) {
    return label ? `[${label}] ${title}` : title;
}

/**
 * Construit le titre complet d'une page.
 */
export function buildDocumentTitle(title, defaultTitle, label) {
    return prefixTitleWithLabel(
        title ? `${title} — ${defaultTitle}` : defaultTitle,
        label
    );
}

/**
 * Applique le marquage visuel de l'environnement (titre initial et favicon)
 * quand un label est défini. Sans label, ne fait rien.
 */
export function applyEnvironmentMarking(label) {
    if (!label) {
        return;
    }

    const currentTitle = document.title;
    if (currentTitle !== "" && !currentTitle.startsWith(`[${label}]`)) {
        document.title = prefixTitleWithLabel(currentTitle, label);
    }

    const icon = document.querySelector('link[rel="icon"]');
    if (icon) {
        icon.setAttribute("href", "/favicon-preprod.svg");
        icon.setAttribute("type", "image/svg+xml");
    }
}
