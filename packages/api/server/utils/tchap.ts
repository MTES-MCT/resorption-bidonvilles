import * as Sentry from '@sentry/node';
import { randomUUID } from 'node:crypto';
import config from '#server/config';
import statusDetails from '#server/utils/statusDetails';
import { getActionFullName } from '#server/utils/formatActionFullName';
import Action from '#root/types/resources/Action.d';
import { EnrichedAction } from '#root/types/resources/ActionEnriched.d';
import { CommentAuthor } from '#root/types/resources/CommentAuthor.d';
import { Shantytown, ShantytownWithEnrichedComments } from '#root/types/resources/Shantytown.d';
import { User } from '#root/types/resources/User.d';

// ============================================================================
// Types
// ============================================================================

/**
 * Représente un champ de notification (label + contenu textuel + lien optionnel).
 */
type NotificationField = {
    // ex: "Site", "Organisation", "Rôle"
    label: string;
    // texte du champ (déjà échappé HTML si nécessaire)
    text: string;
    // optionnel : si présent, le texte sera un lien cliquable en HTML
    url?: string;
    // optionnel : suffixe ajouté après le texte/lien (ex: " (ID du site: #123)")
    suffix?: string;
};

/**
 * Niveau de sévérité d'une notification Tchap.
 */
type NotificationLevel = 'info' | 'warning' | 'critic';

/**
 * Structure complète d'une notification Tchap (emoji de niveau + texte principal + champs détaillés).
 */
type TchapNotification = {
    level: NotificationLevel;
    text: string; // phrase principale après l'emoji de niveau
    fields: NotificationField[];
    timestamp: Date; // calculé une seule fois par l'appelant, pour que html et plainTextFallback affichent la même heure
};

type TchapChannelKey = keyof typeof config.tchap.channels;

/**
 * Salon Tchap effectivement visé : clé logique effective (après bascule hors production)
 * et room ID Matrix configuré.
 */
type TchapChannel = {
    name: TchapChannelKey;
    roomId: string;
};

// ============================================================================
// Constantes de configuration
// ============================================================================

const { tchap, webappUrl } = config;

/**
 * Hôtes pour lesquels http: est toléré hors production (comparaison exacte sur url.hostname).
 */
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * Marqueur qui remplace le room ID du salon visé dans les erreurs transmises à Sentry.
 */
const ROOM_ID_PLACEHOLDER = '[salon]';

/**
 * Profondeur maximale de parcours des causes imbriquées lors de la rédaction d'une erreur.
 */
const MAX_ERROR_CAUSE_DEPTH = 5;

/**
 * Mapping niveau de sévérité → emoji associé.
 */
const NOTIFICATION_LEVEL_EMOJIS: Record<NotificationLevel, string> = {
    info: 'ℹ️',
    warning: '⚠️',
    critic: '🚨',
};

// ============================================================================
// Fonctions utilitaires génériques
// ============================================================================

/**
 * Échappe les caractères HTML spéciaux pour éviter les injections.
 */
const escapeHtml = (text: string): string => text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&#039;');

/**
 * Convertit un fragment HTML (produit avec escapeHtml) en texte brut : les liens sont
 * remplacés par leur libellé (URL omise), les <br/> par des sauts de ligne, les autres
 * balises sont retirées.
 * L'ordre est important : les balises sont retirées AVANT le décodage des entités, sinon un
 * texte utilisateur échappé (&lt;b&gt;) serait décodé puis supprimé comme une vraie balise.
 * &amp; est décodé en dernier pour ne pas décoder deux fois (&amp;lt; donne &lt;).
 */
const htmlToPlainText = (html: string): string => html
    .replaceAll(/<a\s[^>]*>(.*?)<\/a>/gs, '$1')
    .replaceAll(/<br\s*\/?>/gi, '\n')
    .replaceAll(/<[^>]*>/g, '')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', '\'')
    .replaceAll('&#39;', '\'')
    .replaceAll('&amp;', '&');

/**
 * Formate une date en "JJ/MM/AAAA à HH:mm".
 */
const formatDateTime = (dateToFormat: Date): string => {
    const day = String(dateToFormat.getDate()).padStart(2, '0');
    const month = String(dateToFormat.getMonth() + 1).padStart(2, '0');
    const year = dateToFormat.getFullYear();
    const hours = String(dateToFormat.getHours()).padStart(2, '0');
    const minutes = String(dateToFormat.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} à ${hours}:${minutes}`;
};

/**
 * Construit le HTML listant les sites d'origine d'une réinstallation (ou un message
 * par défaut si aucun site d'origine n'a été désigné).
 */
const buildIncomingTownsHtml = (town: Shantytown | ShantytownWithEnrichedComments): string => {
    if (town.reinstallationIncomingTowns.length === 0) {
        return 'Aucun site n\'a été désigné comme origine de la réinstallation';
    }

    const townLinks = town.reinstallationIncomingTowns
        .map(({ id, usename }) => `<a href="${webappUrl}/site/${id}">${escapeHtml(usename)}</a>`)
        .join('<br/>');
    return `Le(s) site(s) suivant(s) ont été désigné(s) comme origine(s) de la réinstallation:<br/>${townLinks}`;
};

/**
 * Nettoie (espaces et barres obliques finales retirés) puis contrôle l'URL du serveur Tchap :
 * elle doit s'analyser par `new URL` et être en https:. Hors production, http: est accepté pour les
 * seuls hôtes localhost, 127.0.0.1 et [::1] (hôte réel lu dans url.hostname, identifiants éventuels exclus).
 * Retourne null (fail closed) si elle est absente, invalide ou non sécurisée.
 */
const sanitizeBaseUrl = (rawBaseUrl: string | undefined): string | null => {
    const cleaned = rawBaseUrl?.trim().replace(/\/+$/, '');
    if (!cleaned) {
        return null;
    }

    let url: URL;
    try {
        url = new URL(cleaned);
    } catch {
        return null;
    }

    if (url.protocol === 'https:') {
        return cleaned;
    }
    if (url.protocol === 'http:' && config.environnement !== 'production' && LOCAL_HOSTNAMES.has(url.hostname)) {
        return cleaned;
    }
    return null;
};

// Calculée au chargement du module ; null = URL refusée (aucune requête, donc jamais de jeton envoyé)
const baseUrl = sanitizeBaseUrl(tchap.baseUrl);

// Garantit un seul signalement Sentry par processus (Sentry n'est pas forcément initialisé à l'import)
let invalidBaseUrlReported = false;

/**
 * Signale à Sentry, une seule fois, que l'URL du serveur Tchap est refusée.
 * Aucune valeur issue de l'URL n'est transmise (elle peut contenir des identifiants).
 */
const reportInvalidBaseUrlOnce = (): void => {
    if (invalidBaseUrlReported) {
        return;
    }
    invalidBaseUrlReported = true;
    Sentry.captureMessage('[Tchap] RB_API_TCHAP_BASE_URL invalide ou non sécurisée (https:// requis) : notification non envoyée', {
        level: 'error',
    });
};

// Room ID Matrix valide (après trim) : commence par "!", sans espace ni saut de ligne ; la partie ":serveur" n'est pas exigée
const ROOM_ID_PATTERN = /^!\S+$/;

/**
 * Résout la clé logique d'un salon vers un TchapChannel (clé effective + room ID Matrix lu dans config.tchap.channels),
 * en basculant systématiquement vers le salon de test (notif-dev-test) en environnement autre
 * que "production" (pour éviter de polluer les vrais salons de notification pendant les tests locaux).
 * Retourne null, après signalement à Sentry, si l'URL du serveur est refusée (voir sanitizeBaseUrl)
 * si le room ID du salon retenu est absent ou vide (une valeur composée uniquement d'espaces
 * est considérée comme absente), ou s'il est invalide (voir ROOM_ID_PATTERN) ; la valeur invalide
 * n'est jamais transmise à Sentry.
 */
const resolveNotifChannel = (channelKey: TchapChannelKey): TchapChannel | null => {
    // URL du serveur refusée : inutile de poursuivre (et de signaler en plus un salon non configuré)
    if (!baseUrl) {
        reportInvalidBaseUrlOnce();
        return null;
    }

    const key: TchapChannelKey = config.environnement !== 'production' ? 'notif-dev-test' : channelKey;
    const roomId = tchap.channels[key]?.trim();
    if (!roomId) {
        Sentry.captureMessage(`[Tchap] Salon "${key}" non configuré : notification non envoyée`, {
            level: 'error',
            extra: { channel: key },
        });
        return null;
    }
    if (!ROOM_ID_PATTERN.test(roomId)) {
        Sentry.captureMessage(`[Tchap] Salon "${key}" : identifiant invalide (un room ID commençant par "!" est attendu) : notification non envoyée`, {
            level: 'error',
            extra: { channel: key },
        });
        return null;
    }
    return { name: key, roomId };
};

/**
 * Génère le rendu HTML d'une liste de champs de notification.
 * Format : <strong>Label</strong>: texte ou <a href="url">texte</a> + suffix optionnel<br/>
 * Le dernier champ n'a pas de <br/> final.
 */
const renderFieldsAsHtml = (fields: NotificationField[]): string => fields
    .map((field, index) => {
        let content = field.text;
        if (field.url) {
            content = `"<a href="${field.url}">${field.text}</a>"`;
        }
        if (field.suffix) {
            content += field.suffix;
        }
        const lineBreak = index < fields.length - 1 ? '<br/>' : '';
        return `<strong>${field.label}</strong>: ${content}${lineBreak}`;
    })
    .join('\n');

/**
 * Génère le rendu texte brut d'une liste de champs de notification.
 * Format : Label: texte + suffix optionnel (l'URL est ignorée en texte brut pour éviter la redondance)
 * Chaque champ est sur une ligne séparée par \n.
 */
const renderFieldsAsPlainText = (fields: NotificationField[]): string => fields
    .map((field) => {
        let content = htmlToPlainText(field.text);
        if (field.suffix) {
            content += htmlToPlainText(field.suffix);
        }
        return `${field.label}: ${content}`;
    })
    .join('\n');

/**
 * Génère le rendu HTML complet d'une notification Tchap.
 * Format : en-tête bot + date, <hr/>, emoji de niveau + texte, champs rendus en HTML.
 */
const renderNotificationAsHtml = (notification: TchapNotification): string => {
    const levelEmoji = NOTIFICATION_LEVEL_EMOJIS[notification.level];
    const fieldsHtml = notification.fields.length > 0 ? `<br/>\n${renderFieldsAsHtml(notification.fields)}` : '';

    return `
🤖 <strong>Alerte Résorption bidonvilles</strong> - ${formatDateTime(notification.timestamp)}
<hr/>
${levelEmoji} ${notification.text}${fieldsHtml}
`.trim();
};

/**
 * Génère le rendu texte brut complet d'une notification Tchap.
 * Format : en-tête bot + date, emoji de niveau + texte, champs rendus en texte brut.
 */
const renderNotificationAsPlainText = (notification: TchapNotification): string => {
    const levelEmoji = NOTIFICATION_LEVEL_EMOJIS[notification.level];
    const fieldsPlainText = notification.fields.length > 0 ? `\n${renderFieldsAsPlainText(notification.fields)}` : '';

    return `🤖 Alerte Résorption bidonvilles - ${formatDateTime(notification.timestamp)}
${levelEmoji} ${htmlToPlainText(notification.text)}${fieldsPlainText}`;
};

/**
 * Envoie un événement Matrix (message) dans un salon donné.
 * Fonction interne utilisée par sendHtmlMessage.
 *
 * @param safeBaseUrl - URL du serveur Tchap, nettoyée et validée par sanitizeBaseUrl
 * @param roomId - Identifiant Matrix du salon (format !xxx:serveur)
 * @param payload - Contenu du message au format Matrix (msgtype, body, format, formatted_body, etc.)
 * @returns La Response finale ou null si le token Tchap n'est pas configuré
 */
const sendMatrixEvent = async (safeBaseUrl: string, roomId: string, payload: Record<string, unknown>): Promise<Response | null> => {
    if (!tchap.token) {
        Sentry.captureMessage('[Tchap] Impossible d\'envoyer le message : token Tchap non configuré', {
            level: 'error',
        });
        return null;
    }

    const txnId = `req_${Date.now()}_${randomUUID()}`;
    const sendUrl = `${safeBaseUrl}/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/send/m.room.message/${txnId}`;

    return fetch(sendUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tchap.token}`,
        },
        body: JSON.stringify(payload),
    });
};

const escapeRegExp = (text: string): string => text.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

/**
 * Construit une expression qui reconnaît un texte brut ou tel qu'encodé par encodeURIComponent
 * (en majuscules comme en minuscules, y compris à demi encodé, caractère par caractère).
 */
const toEncodingTolerantPattern = (text: string): string => [...text]
    .map((char) => {
        const encoded = encodeURIComponent(char);
        return encoded === char ? escapeRegExp(char) : `(?:${escapeRegExp(char)}|${escapeRegExp(encoded)})`;
    })
    .join('');

/**
 * Retourne une fonction qui remplace par un marqueur le room ID fourni, sous toutes ses formes
 * (brute, encodée, à demi encodée, partie identifiant seule).
 */
const createRoomIdRedactor = (roomId: string): ((text: string) => string) => {
    const patterns = [roomId, roomId.replace(/^[!#]/, '').split(':')[0]]
        .filter(Boolean)
        .sort((a, b) => b.length - a.length)
        .map(toEncodingTolerantPattern);
    if (patterns.length === 0) {
        return (text: string): string => text;
    }
    const regex = new RegExp(patterns.join('|'), 'gi');
    return (text: string): string => text.replace(regex, ROOM_ID_PLACEHOLDER);
};

/**
 * Produit une copie d'une erreur dont le room ID est rédigé (message, stack, propriétés textuelles
 * comme `input`, et causes imbriquées), pour qu'aucun identifiant de salon ne parte vers Sentry.
 * Les propriétés non textuelles sont écartées. Le parcours est limité en profondeur et protégé
 * contre les références circulaires.
 */
const sanitizeErrorForSentry = (
    error: unknown,
    redact: (text: string) => string,
    depth = 0,
    seen = new WeakSet<object>(),
): unknown => {
    if (typeof error === 'string') {
        return redact(error);
    }
    if (!(error instanceof Error) || seen.has(error)) {
        return undefined;
    }
    seen.add(error);

    const copy = new Error(redact(error.message));
    copy.name = error.name;
    copy.stack = error.stack === undefined ? undefined : redact(error.stack);
    Object.entries(error).forEach(([key, value]) => {
        if (typeof value === 'string') {
            Object.assign(copy, { [key]: redact(value) });
        }
    });

    const { cause } = error as Error & { cause?: unknown };
    if (cause !== undefined && depth < MAX_ERROR_CAUSE_DEPTH) {
        Object.assign(copy, { cause: sanitizeErrorForSentry(cause, redact, depth + 1, seen) });
    }
    return copy;
};

/**
 * Envoie un message HTML natif dans un salon Tchap/Matrix.
 * Fonction dédiée pour construire directement du HTML sans passer par Markdown.
 * Aucun retry : un échec (exception, réponse HTTP non ok, token absent) est signalé à Sentry
 * sans aucune donnée du message ni room ID (seul le nom de la clé logique du salon est transmis),
 * puis l'envoi est abandonné. En cas d'exception, l'erreur d'origine est reliée à l'événement par
 * `cause`, après rédaction du room ID (voir sanitizeErrorForSentry).
 * Si RB_API_TCHAP_BASE_URL est refusée (voir sanitizeBaseUrl), rien n'est envoyé.
 */
const sendHtmlMessage = async (channel: TchapChannel | null, html: string, plainTextFallback: string): Promise<void> => {
    // Si pas de config Tchap ou pas de canal spécifié, on abandonne
    if (!channel) {
        return;
    }

    if (!baseUrl) {
        reportInvalidBaseUrlOnce();
        return;
    }

    try {
        // 1. Construction du payload Matrix avec HTML natif
        const payload = {
            msgtype: 'm.text',
            body: plainTextFallback,
            format: 'org.matrix.custom.html',
            formatted_body: html,
        };

        // 2. Envoi via la fonction partagée
        const response = await sendMatrixEvent(baseUrl, channel.roomId, payload);

        // 3. Gestion des erreurs
        if (!response) {
            Sentry.captureMessage('[Tchap] Impossible d\'envoyer le message HTML : token Tchap non configuré', {
                level: 'error',
                extra: { channel: channel.name },
            });
            return;
        }

        if (!response.ok) {
            Sentry.captureMessage(`[Tchap] Échec d'envoi (${response.status} ${response.statusText})`, {
                level: 'warning',
                extra: { channel: channel.name },
            });
        }
    } catch (error: unknown) {
        // L'erreur d'origine (pile comprise) est transmise en `cause`, uniquement après rédaction du room ID
        const redact = createRoomIdRedactor(channel.roomId);
        const message = `[Tchap] Une erreur est survenue lors de la tentative d'envoi d'une notification vers le salon "${channel.name}"`;
        Sentry.captureException(Object.assign(new Error(message), { cause: sanitizeErrorForSentry(error, redact) }), {
            extra: { channel: channel.name },
        });
    }
};

const checkLocation = (user: User): string => {
    let locationText = 'Inconnu';
    if (user.intervention_areas.is_national) {
        locationText = 'National';
    } else {
        const area = user.intervention_areas.areas.find(a => a.is_main_area && a.type !== 'nation');
        if (area !== undefined) {
            locationText = area[area.type].name;
        }
    }
    return locationText;
};

/**
 * Construit les champs de notification communs décrivant un utilisateur : son territoire
 * de rattachement, son organisation et sa fonction.
 */
const buildUserLocationFields = (user: User): NotificationField[] => [
    {
        label: 'Territoire de rattachement',
        text: escapeHtml(checkLocation(user)),
    },
    {
        label: 'Organisation',
        text: escapeHtml(user.organization.name),
    },
    {
        label: 'Fonction',
        text: escapeHtml(user.position),
    },
];

const formatDate = (dateToFormat: Date): string => {
    const day = String(dateToFormat.getUTCDate()).padStart(2, '0');
    const month = String(dateToFormat.getUTCMonth() + 1).padStart(2, '0');
    const year = dateToFormat.getUTCFullYear();
    return `${day}/${month}/${year}`;
};

const formatTownStatus = (status: string): string => {
    const statusMapping: { [key: string]: string } = statusDetails;
    return statusMapping[status] || status;
};

// ============================================================================
// Fonctions trigger*
// ============================================================================

async function triggerActorInvitedAlert(town: Shantytown, host: User, invited: User | string): Promise<void> {
    const notifChannel = resolveNotifChannel('notif-invitations-intervenants');

    const townName = escapeHtml(town.name || town.usename);
    const townUrl = `${webappUrl}/site/${town.id}`;
    const hostFullName = `${escapeHtml(host.first_name)} ${escapeHtml(host.last_name)}`;
    const hostProfileUrl = `${webappUrl}/acces/${host.id}`;

    // Construction du libellé de la personne invitée selon le type
    let invitedLabel: string;
    if (typeof invited === 'string') {
        // Cas email : affichage en texte brut échappé, sans lien
        invitedLabel = escapeHtml(invited);
    } else {
        // Cas utilisateur existant : lien vers son profil
        invitedLabel = `<a href="${webappUrl}/acces/${invited.id}">${escapeHtml(invited.first_name)} ${escapeHtml(invited.last_name)}</a>`;
    }

    // Texte principal de la notification (unifié)
    const text = `<a href="${hostProfileUrl}">${hostFullName}</a> a invité ${invitedLabel} à se déclarer intervenant sur le site "<a href="${townUrl}">${townName}</a>"`;

    // Construction de l'objet notification complet (pas de champs)
    const notification: TchapNotification = {
        level: 'info',
        text,
        fields: [],
        timestamp: new Date(),
    };

    // Génération des rendus HTML et texte brut
    const html = renderNotificationAsHtml(notification);
    const plainTextFallback = renderNotificationAsPlainText(notification);

    await sendHtmlMessage(notifChannel, html, plainTextFallback);
}

export async function triggerAttachmentArchiveCleanup(deleteRequestsCount: number, errorsCount: number): Promise<void> {
    const notifChannel = resolveNotifChannel('notif-nettoyage-pieces-jointes');

    const text = `Un nettoyage automatique des fichiers vient d'être effectué pour un total de ${deleteRequestsCount} fichiers à supprimer et ${errorsCount} erreurs rencontrées`;

    const notification: TchapNotification = {
        level: 'info',
        text,
        fields: [],
        timestamp: new Date(),
    };

    const html = renderNotificationAsHtml(notification);
    const plainTextFallback = renderNotificationAsPlainText(notification);

    await sendHtmlMessage(notifChannel, html, plainTextFallback);
}

export async function triggerAttachmentArchiveCleanupError(): Promise<void> {
    const notifChannel = resolveNotifChannel('notif-nettoyage-pieces-jointes');

    const text = 'Une erreur est survenue lors du DELETE en base de données';

    const notification: TchapNotification = {
        level: 'critic',
        text,
        fields: [],
        timestamp: new Date(),
    };

    const html = renderNotificationAsHtml(notification);
    const plainTextFallback = renderNotificationAsPlainText(notification);

    await sendHtmlMessage(notifChannel, html, plainTextFallback);
}

async function triggerDeclaredActor(town: Shantytown, user: User): Promise<void> {
    const notifChannel = resolveNotifChannel('notif-intervenants-declares');

    const townName = escapeHtml(town.name || town.usename);
    const townUrl = `${webappUrl}/site/${town.id}`;
    const userFullName = `${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}`;
    const userProfileUrl = `${webappUrl}/acces/${user.id}`;

    // Texte principal de la notification
    const text = `<a href="${userProfileUrl}">${userFullName}</a> s'est déclaré comme intervenant sur le site "<a href="${townUrl}">${townName}</a>"`;

    // Construction de l'objet notification complet (pas de champs)
    const notification: TchapNotification = {
        level: 'info',
        text,
        fields: [],
        timestamp: new Date(),
    };

    // Génération des rendus HTML et texte brut
    const html = renderNotificationAsHtml(notification);
    const plainTextFallback = renderNotificationAsPlainText(notification);

    await sendHtmlMessage(notifChannel, html, plainTextFallback);
}

const triggerHeatwaveStatusChange = async (user: User, town: Shantytown, heatwaveStatus: boolean): Promise<void> => {
    const organizationAbbreviation: string = user.organization.abbreviation ? ` (${user.organization.abbreviation})` : '';

    const notifChannel = resolveNotifChannel('notif-canicule');

    const userFullName = `${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}`;
    const userProfileUrl = `${webappUrl}/acces/${user.id}`;
    const townName = escapeHtml(town.name || town.usename);
    const townUrl = `${webappUrl}/site/${town.id}`;
    const orgName = escapeHtml(user.organization.name);
    const userPosition = escapeHtml(user.position);
    const statusVerb = heatwaveStatus ? 'activée' : 'désactivée';
    const statusEmoji = heatwaveStatus ? '☀️' : '❎';

    // Détermination du niveau de sévérité :
    // - 'critic' si activation (heatwaveStatus === true) : situation urgente, alerte active
    // - 'warning' si désactivation (heatwaveStatus === false) : retour à la normale, moins urgent
    const level: NotificationLevel = heatwaveStatus ? 'critic' : 'warning';

    // Construction du texte principal de la notification (avec lien vers le profil de l'utilisateur)
    const text = `Une alerte canicule a été ${statusVerb} par <a href="${userProfileUrl}">${userFullName}</a> ${user.email}`;

    // Modélisation du contenu des champs en structure neutre (source de vérité unique)
    const fields: NotificationField[] = [
        {
            label: 'Site',
            text: townName,
            url: townUrl,
            suffix: ` (ID du site: #${town.id})`,
        },
        {
            label: 'Organisation',
            text: `${orgName}${organizationAbbreviation}`,
        },
        {
            label: 'Rôle',
            text: userPosition,
        },
        {
            label: "Statut de l'alerte",
            text: `${statusVerb} ${statusEmoji}`,
        },
    ];

    // Construction de l'objet notification complet
    const notification: TchapNotification = {
        level,
        text,
        fields,
        timestamp: new Date(),
    };

    // Génération des rendus HTML et texte brut à partir de la notification
    const html = renderNotificationAsHtml(notification);
    const plainTextFallback = renderNotificationAsPlainText(notification);

    await sendHtmlMessage(notifChannel, html, plainTextFallback);
};


async function triggerLandRegistryRequest(user: User, parcel: string, dataYear: string): Promise<void> {
    const notifChannel = resolveNotifChannel('notif-requetes-cadastre');

    const userFullName = `${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}`;
    const userProfileUrl = `${webappUrl}/acces/${user.id}`;

    const text = `Demande d'information cadastre de: <a href="${userProfileUrl}">${userFullName}</a> ${user.email}`;

    const fields: NotificationField[] = [
        ...buildUserLocationFields(user),
        {
            label: 'Parcelle concernée',
            text: escapeHtml(parcel),
        },
        {
            label: 'Millésime des données du cadastre',
            text: escapeHtml(dataYear),
        },
    ];

    const notification: TchapNotification = {
        level: 'info',
        text,
        fields,
        timestamp: new Date(),
    };

    const html = renderNotificationAsHtml(notification);
    const plainTextFallback = renderNotificationAsPlainText(notification);

    await sendHtmlMessage(notifChannel, html, plainTextFallback);
}

async function triggerNewActionComment(comment: string, action: Action, author: CommentAuthor): Promise<void> {
    const notifChannel = resolveNotifChannel('notif-action-nouveau-commentaire');

    const actionFullName = (await getActionFullName(action.id)) ?? action.name;
    const actionName = escapeHtml(actionFullName);
    const actionUrl = `${webappUrl}/action/${action.id}`;
    const userFullName = `${escapeHtml(author.first_name)} ${escapeHtml(author.last_name)}`;
    const userProfileUrl = `${webappUrl}/acces/${author.id}`;

    // Texte principal de la notification
    const text = `Un commentaire a été ajouté sur l'action "<a href="${actionUrl}">${actionName}</a>" par <a href="${userProfileUrl}">${userFullName}</a>`;

    // Construction des champs de notification
    const fields: NotificationField[] = [
        {
            label: 'Commentaire',
            text: escapeHtml(comment),
        },
    ];

    // Construction de l'objet notification complet
    const notification: TchapNotification = {
        level: 'info',
        text,
        fields,
        timestamp: new Date(),
    };

    // Génération des rendus HTML et texte brut
    const html = renderNotificationAsHtml(notification);
    const plainTextFallback = renderNotificationAsPlainText(notification);

    await sendHtmlMessage(notifChannel, html, plainTextFallback);
}

async function triggerNewComment(commentDescription: string, tagLabels: string[], town: Shantytown, author: User): Promise<void> {
    const notifChannel = resolveNotifChannel('notif-site-nouveau-commentaire');

    const townName = escapeHtml(town.name || town.usename);
    const townUrl = `${webappUrl}/site/${town.id}`;
    const userFullName = `${escapeHtml(author.first_name)} ${escapeHtml(author.last_name)}`;
    const userProfileUrl = `${webappUrl}/acces/${author.id}`;

    // Texte principal de la notification
    const text = `Un commentaire a été ajouté sur le site "<a href="${townUrl}">${townName}</a>" par <a href="${userProfileUrl}">${userFullName}</a>`;

    // Construction des champs de notification
    const fields: NotificationField[] = [
        {
            label: 'Commentaire',
            text: escapeHtml(commentDescription),
        },
    ];

    if (tagLabels.length > 0) {
        fields.push({
            label: tagLabels.length > 1 ? 'Qualifications du commentaire' : 'Qualification du commentaire',
            text: escapeHtml(tagLabels.join(', ')),
        });
    }

    // Construction de l'objet notification complet
    const notification: TchapNotification = {
        level: 'info',
        text,
        fields,
        timestamp: new Date(),
    };

    // Génération des rendus HTML et texte brut
    const html = renderNotificationAsHtml(notification);
    const plainTextFallback = renderNotificationAsPlainText(notification);

    await sendHtmlMessage(notifChannel, html, plainTextFallback);
}

async function triggerNewUserAlert(user: User): Promise<void> {
    const notifChannel = resolveNotifChannel('notif-nouveaux-utilisateurs');

    const userFullName = `${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}`;
    const userProfileUrl = `${webappUrl}/acces/${user.id}`;

    // Texte principal de la notification
    const text = `Nouvel utilisateur: <a href="${userProfileUrl}">${userFullName}</a> ${user.email}`;

    // Construction des champs de notification
    const fields: NotificationField[] = buildUserLocationFields(user);

    // Construction de l'objet notification complet
    const notification: TchapNotification = {
        level: 'info',
        text,
        fields,
        timestamp: new Date(),
    };

    // Génération des rendus HTML et texte brut
    const html = renderNotificationAsHtml(notification);
    const plainTextFallback = renderNotificationAsPlainText(notification);

    await sendHtmlMessage(notifChannel, html, plainTextFallback);
}

async function triggerNotifyNewUserFromRectorat(user: User): Promise<void> {
    const notifChannel = resolveNotifChannel('tech');

    const userFullName = `${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}`;
    const userProfileUrl = `${webappUrl}/acces/${user.id}`;

    const text = `L'utilisateur(ice) <a href="${userProfileUrl}">${userFullName}</a>, membre de Rectorat, a demandé un accès. Merci d'étendre ses droits d'accès à toute l'académie`;

    const notification: TchapNotification = {
        level: 'info',
        text,
        fields: [],
        timestamp: new Date(),
    };

    const html = renderNotificationAsHtml(notification);
    const plainTextFallback = renderNotificationAsPlainText(notification);

    await sendHtmlMessage(notifChannel, html, plainTextFallback);
}

async function triggerNotifyNewUserSelfDeactivation(user: User): Promise<void> {
    const notifChannel = resolveNotifChannel('notif-auto-desactivations');

    const userFullName = `${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}`;
    const userProfileUrl = `${webappUrl}/acces/${user.id}`;

    const text = `L'utilisateur(ice) <a href="${userProfileUrl}">${userFullName}</a> vient de désactiver son accès à la plateforme`;

    const notification: TchapNotification = {
        level: 'info',
        text,
        fields: [],
        timestamp: new Date(),
    };

    const html = renderNotificationAsHtml(notification);
    const plainTextFallback = renderNotificationAsPlainText(notification);

    await sendHtmlMessage(notifChannel, html, plainTextFallback);
}

async function triggerNotifyOwnersAnonymization(shantytownLines: number, shantytownHistoryLines: number): Promise<void> {
    const createLinesMessage = (count: number): string => {
        if (count <= 0) {
            return 'Aucune ligne';
        }
        return count === 1 ? `${count} ligne` : `${count} lignes`;
    };

    const shantytownLinesMessage = createLinesMessage(shantytownLines);
    const shantytownHistoryLinesMessage = createLinesMessage(shantytownHistoryLines);

    const notifChannel = resolveNotifChannel('notif-anonymisation');

    const text = 'Une anonymisation automatique des propriétaires vient d\'être lancée:';

    const fields: NotificationField[] = [
        {
            label: 'Sites',
            text: escapeHtml(`${shantytownLinesMessage} ${shantytownLines > 1 ? 'traitées' : 'traitée'} dans la table des sites`),
        },
        {
            label: 'Historique des sites',
            text: escapeHtml(`${shantytownHistoryLinesMessage} ${shantytownHistoryLines > 1 ? 'traitées' : 'traitée'} dans l'historique des sites`),
        },
    ];

    const notification: TchapNotification = {
        level: 'info',
        text,
        fields,
        timestamp: new Date(),
    };

    const html = renderNotificationAsHtml(notification);
    const plainTextFallback = renderNotificationAsPlainText(notification);

    await sendHtmlMessage(notifChannel, html, plainTextFallback);
}

export async function triggerNotifyOwnersAnonymizationError(message: string): Promise<void> {
    const notifChannel = resolveNotifChannel('notif-anonymisation');

    const text = 'Une erreur est survenue lors de l\'anonymisation des propriétaires en base de données';

    const fields: NotificationField[] = [
        {
            label: 'Erreur',
            text: escapeHtml(message),
        },
    ];

    const notification: TchapNotification = {
        level: 'critic',
        text,
        fields,
        timestamp: new Date(),
    };

    const html = renderNotificationAsHtml(notification);
    const plainTextFallback = renderNotificationAsPlainText(notification);

    await sendHtmlMessage(notifChannel, html, plainTextFallback);
}

async function triggerPeopleInvitedAlert(guests: User[], greeter: User, msg: string): Promise<void> {
    const notifChannel = resolveNotifChannel('notif-personnes-invitees');

    // Construction du libellé du greeter (invitant) selon qu'il a un id ou non
    let greeterLabel: string;
    if (greeter.id) {
        // Utilisateur existant : lien vers son profil
        const greeterFullName = `${escapeHtml(greeter.first_name)} ${escapeHtml(greeter.last_name)}`;
        const greeterProfileUrl = `${webappUrl}/acces/${greeter.id}`;
        greeterLabel = `<a href="${greeterProfileUrl}">${greeterFullName}</a>`;
    } else {
        // Invité externe : juste le nom et email en lien mailto
        const greeterFullName = `${escapeHtml(greeter.first_name)} ${escapeHtml(greeter.last_name)}`;
        greeterLabel = `<a href="mailto:${escapeHtml(greeter.email)}">${greeterFullName}</a>`;
    }

    // Texte principal avec le message optionnel, accordé au pluriel selon le nombre d'invités
    const messageText = msg ? ` ${escapeHtml(msg)}` : '';
    const text = guests.length === 1
        ? `Personne invitée sur la plateforme par ${greeterLabel}${messageText}`
        : `Personnes invitées sur la plateforme par ${greeterLabel}${messageText}`;

    // Construction des champs : un champ distinct par invité, numéroté si plusieurs
    const fields: NotificationField[] = guests.map((guest, index) => {
        const guestFullName = `${escapeHtml(guest.first_name)} ${escapeHtml(guest.last_name)}`;
        const guestLabel = `<a href="mailto:${escapeHtml(guest.email)}">${guestFullName}</a>`;

        return {
            label: guests.length === 1 ? 'Personne invitée' : `Personne invitée ${index + 1}`,
            text: guestLabel,
        };
    });

    const notification: TchapNotification = {
        level: 'info',
        text,
        fields,
        timestamp: new Date(),
    };

    const html = renderNotificationAsHtml(notification);
    const plainTextFallback = renderNotificationAsPlainText(notification);

    await sendHtmlMessage(notifChannel, html, plainTextFallback);
}

async function triggerRemoveDeclaredActor(town: Shantytown, user: User): Promise<void> {
    const notifChannel = resolveNotifChannel('notif-intervenants-declares');

    const townName = escapeHtml(town.name || town.usename);
    const townUrl = `${webappUrl}/site/${town.id}`;
    const userFullName = `${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}`;
    const userProfileUrl = `${webappUrl}/acces/${user.id}`;

    // Texte principal de la notification
    const text = `<a href="${userProfileUrl}">${userFullName}</a> a cessé d'intervenir sur le site "<a href="${townUrl}">${townName}</a>"`;

    // Construction de l'objet notification complet (pas de champs)
    const notification: TchapNotification = {
        level: 'info',
        text,
        fields: [],
        timestamp: new Date(),
    };

    // Génération des rendus HTML et texte brut
    const html = renderNotificationAsHtml(notification);
    const plainTextFallback = renderNotificationAsPlainText(notification);

    await sendHtmlMessage(notifChannel, html, plainTextFallback);
}

async function triggerRequestActionPilot(action: EnrichedAction, user: User): Promise<boolean> {
    const notifChannel = resolveNotifChannel('notif-absence-pilote-action');

    const userFullName = `${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}`;
    const userProfileUrl = `${webappUrl}/acces/${user.id}`;
    const actionName = escapeHtml(action.name);
    const actionUrl = `${webappUrl}/action/${action.id}`;

    const text = `<a href="${userProfileUrl}">${userFullName}</a> a demandé un pilote pour l'action "<a href="${actionUrl}">${actionName}</a>"`;

    const notification: TchapNotification = {
        level: 'info',
        text,
        fields: [],
        timestamp: new Date(),
    };

    const html = renderNotificationAsHtml(notification);
    const plainTextFallback = renderNotificationAsPlainText(notification);

    await sendHtmlMessage(notifChannel, html, plainTextFallback);
    return true;
}

async function triggerShantytownCloseAlert(town: Shantytown, user: User): Promise<void> {
    const notifChannel = resolveNotifChannel('notif-fermeture-sites');

    const townName = escapeHtml(town.name || town.usename);
    const townUrl = `${webappUrl}/site/${town.id}`;
    const userFullName = `${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}`;
    const userProfileUrl = `${webappUrl}/acces/${user.id}`;

    const text = `Fermeture de site: "<a href="${townUrl}">${townName}</a>" par <a href="${userProfileUrl}">${userFullName}</a>`;

    const builtAtStr = town.builtAt ? formatDate(new Date(town.builtAt * 1000)) : 'Non renseignée';
    const declaredAtStr = formatDate(new Date(town.declaredAt * 1000));
    const closedAtStr = formatDate(new Date(town.closedAt * 1000));
    const townStatus = formatTownStatus(town.status);
    const resorptionTarget = town.resorptionTarget ? town.resorptionTarget : 'non';

    const fields: NotificationField[] = [
        {
            label: 'Statut',
            text: escapeHtml(town.closedWithSolutions && town.closedWithSolutions !== 'no' ? 'Résorbé' : 'Disparu'),
        },
        {
            label: 'Cause de la fermeture',
            text: escapeHtml(townStatus),
        },
        {
            label: 'Nombre d\'habitants',
            text: escapeHtml(String(town.populationTotal || 'Nombre inconnu')),
        },
        {
            label: 'Date d\'installation du site',
            text: escapeHtml(builtAtStr),
        },
        {
            label: 'Date de signalement du site',
            text: escapeHtml(declaredAtStr),
        },
        {
            label: 'Date de fermeture du site',
            text: escapeHtml(closedAtStr),
        },
        {
            label: 'Site avec objectif résorption',
            text: escapeHtml(String(resorptionTarget)),
        },
    ];

    const notification: TchapNotification = {
        level: 'info',
        text,
        fields,
        timestamp: new Date(),
    };

    const html = renderNotificationAsHtml(notification);
    const plainTextFallback = renderNotificationAsPlainText(notification);

    await sendHtmlMessage(notifChannel, html, plainTextFallback);
}

export async function triggerReinstallationAlert(town: Shantytown | ShantytownWithEnrichedComments, user: User): Promise<void> {
    const notifChannel = resolveNotifChannel('notif-reinstallation');

    const townName = escapeHtml(town.name || town.usename);
    const townUrl = `${webappUrl}/site/${town.id}`;
    const userFullName = `${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}`;
    const userProfileUrl = `${webappUrl}/acces/${user.id}`;

    const text = `Réinstallation signalée sur le site "<a href="${townUrl}">${townName}</a>" par <a href="${userProfileUrl}">${userFullName}</a>`;

    const fields: NotificationField[] = [
        {
            label: 'Nombre d\'habitants',
            text: escapeHtml(String(town.populationTotal || 'Nombre inconnu')),
        },
        {
            label: 'Sites d\'origine',
            text: buildIncomingTownsHtml(town),
        },
    ];

    if (town.reinstallationComments) {
        fields.push({
            label: 'Commentaire',
            text: escapeHtml(town.reinstallationComments),
        });
    }

    const notification: TchapNotification = {
        level: 'warning',
        text,
        fields,
        timestamp: new Date(),
    };

    const html = renderNotificationAsHtml(notification);
    const plainTextFallback = renderNotificationAsPlainText(notification);

    await sendHtmlMessage(notifChannel, html, plainTextFallback);
}

export async function triggerShantytownCreationAlert(town: Shantytown, user: User): Promise<void> {
    const notifChannel = resolveNotifChannel('notif-ouverture-sites');

    const townName = escapeHtml(town.name || town.usename);
    const townUrl = `${webappUrl}/site/${town.id}`;
    const userFullName = `${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}`;
    const userProfileUrl = `${webappUrl}/acces/${user.id}`;

    const text = `Site ouvert "<a href="${townUrl}">${townName}</a>" par <a href="${userProfileUrl}">${userFullName}</a>`;

    const builtAtStr = formatDate(new Date(town.builtAt * 1000));
    const declaredAtStr = formatDate(new Date(town.declaredAt * 1000));

    const fields: NotificationField[] = [
        {
            label: 'Nombre d\'habitants',
            text: escapeHtml(String(town.populationTotal || 'Nombre inconnu')),
        },
        {
            label: 'Date d\'installation du site',
            text: escapeHtml(builtAtStr),
        },
        {
            label: 'Date de signalement du site',
            text: escapeHtml(declaredAtStr),
        },
        {
            label: 'Sites d\'origine',
            text: buildIncomingTownsHtml(town),
        },
    ];

    const notification: TchapNotification = {
        level: 'info',
        text,
        fields,
        timestamp: new Date(),
    };

    const html = renderNotificationAsHtml(notification);
    const plainTextFallback = renderNotificationAsPlainText(notification);

    await sendHtmlMessage(notifChannel, html, plainTextFallback);
}

export default {
    triggerActorInvitedAlert,
    triggerAttachmentArchiveCleanup,
    triggerAttachmentArchiveCleanupError,
    triggerDeclaredActor,
    triggerHeatwaveStatusChange,
    triggerLandRegistryRequest,
    triggerNewActionComment,
    triggerNewComment,
    triggerNewUserAlert,
    triggerNotifyNewUserFromRectorat,
    triggerNotifyNewUserSelfDeactivation,
    triggerNotifyOwnersAnonymization,
    triggerNotifyOwnersAnonymizationError,
    triggerPeopleInvitedAlert,
    triggerReinstallationAlert,
    triggerRemoveDeclaredActor,
    triggerRequestActionPilot,
    triggerShantytownCloseAlert,
    triggerShantytownCreationAlert,
};
