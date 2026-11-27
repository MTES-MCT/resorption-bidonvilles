const PROPERTY_FILTERS = ["topic", "interventionLocation", "dihalFinancing"];

function isFilled(value) {
    return value !== undefined && value !== null && value !== "";
}

function toListOfStrings(value) {
    const values = Array.isArray(value) ? value : [value];
    return values.filter(isFilled).map(String);
}

function buildLocationParams(location) {
    // Une localisation de type structure est décrite par `type: "organization"`
    // et `organizationId` ; une localisation géographique par `typeUid` et `code`.
    const typeUid = location.typeUid ?? location.type;
    if (!isFilled(typeUid)) {
        return {};
    }

    const params = {
        locationType: location.type ?? typeUid,
        locationTypeUid: typeUid,
    };

    if (isFilled(location.code)) {
        params.locationCode = String(location.code);
    }

    if (isFilled(location.organizationId)) {
        params.locationOrganizationId = location.organizationId;
    }

    return params;
}

/**
 * Construit les paramètres de requête de l'export Excel des actions à partir
 * de l'onglet actif et des filtres de la liste, de la même manière que
 * `filteredActions` (actions.store.js) filtre l'onglet.
 *
 * Les valeurs vides sont ignorées : une clé absente désigne un filtre inactif.
 *
 * Renvoie `null` quand l'export est impossible (onglet myOrganization pour un
 * utilisateur sans structure) : l'appelant doit alors désactiver l'export.
 *
 * @param {Object} options
 * @param {"open"|"closed"|"myOrganization"} options.status Onglet actif
 * @param {string} [options.search] Recherche libre
 * @param {Object|null} [options.location] Localisation filtrée
 * @param {Object} [options.properties] Filtres topic / interventionLocation / dihalFinancing
 * @param {number} [options.userOrganizationId] Structure de l'utilisateur (onglet myOrganization)
 */
export default function buildActionsExportParams({
    status,
    search,
    location,
    properties,
    userOrganizationId,
}) {
    const params = {};

    if (status === "myOrganization") {
        // Sans structure, la liste de l'onglet est vide et il n'y a rien à
        // exporter : omettre organizationId exporterait toutes les actions.
        if (!isFilled(userOrganizationId)) {
            return null;
        }

        // Comme dans le store : seules les actions en cours de la structure.
        params.status = "open";
        params.organizationId = userOrganizationId;
    } else if (status === "open" || status === "closed") {
        params.status = status;
    }

    if (location) {
        Object.assign(params, buildLocationParams(location));
    } else if (search) {
        // La recherche libre n'est appliquée que sans localisation (filterActions).
        params.search = search;
    }

    PROPERTY_FILTERS.forEach((field) => {
        const values = toListOfStrings(properties?.[field]);
        if (values.length > 0) {
            params[field] = values;
        }
    });

    return params;
}
