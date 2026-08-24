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

type TchapChannelKey = keyof typeof TCHAP_CHANNELS;

// ============================================================================
// Constantes de configuration
// ============================================================================

const { tchap, webappUrl } = config;

// Note — instance sandbox dev01.tchap.incubateur.net : le proxy Caddy en amont applique
// un filtrage par liste blanche sur le header User-Agent, mais UNIQUEMENT sur l'endpoint
// /login (confirmé par tests curl comparatifs — "node" ou toute valeur hors liste blanche
// y est rejeté en 403 M_FORBIDDEN, avant même la vérification des identifiants). Les
// endpoints /send et /directory/room ne sont pas concernés. C'est pourquoi l'authentification
// se fait via un token statique obtenu manuellement (voir RB_API_TCHAP_TOKEN dans .env /
// config.ts) plutôt qu'un login automatique depuis l'application — à reprendre avec
// l'administrateur Tchap avant l'implémentation définitive / le passage en production.

const TCHAP_CHANNELS = {
    'notif-dev-test': '!ACZQkXFLuYbMHsUkuy:dev01.tchap.incubateur.net',
    'notif-invitations-intervenants': '!wslIZrwttMBocvElcJ:dev01.tchap.incubateur.net',
    'notif-nettoyage-piecesjointes': '!LFQXdWBrmtCXyGySVu:dev01.tchap.incubateur.net',
    'notif-intervenants-declares': '!BqKSaiqdbWHvTMXPpK:dev01.tchap.incubateur.net',
    'notif-canicule': '!BEFPavPCSuDRSTNyRh:dev01.tchap.incubateur.net',
    'notif-requetes-cadastre': '!qkzVpjgvmRxQrqEPMu:dev01.tchap.incubateur.net',
    'notif-action-nouveau-commentaire': '!kXoLdTKpuphtlFtbjl:dev01.tchap.incubateur.net',
    'notif-site-nouveau-commentaire': '!AnMHnJRgMsxZGBSKYc:dev01.tchap.incubateur.net',
    'notif-nouveaux-utilisateurs': '!jnnXdNkBSszdhyAYvN:dev01.tchap.incubateur.net',
    tech: '!GwVHNVyVNrTsAcNshs:dev01.tchap.incubateur.net',
    'notif-auto-desactivations': '!bvkDdQPkWIFcaVJlKv:dev01.tchap.incubateur.net',
    'notif-anonymisation': '!tWZQJEPaqdvAkzFuvW:dev01.tchap.incubateur.net',
    'notif-personnes-invitees': '!fcRFOFBrkXkMGqYdOk:dev01.tchap.incubateur.net',
    'notif-absence-pilote-action': '!OqlLzaEOcVwFGHiEga:dev01.tchap.incubateur.net',
    'notif-fermeture-sites': '!swmPvwsxQGcqTOgYPw:dev01.tchap.incubateur.net',
    'notif-reinstallation': '!muHrBsrXzYGABPQKxB:dev01.tchap.incubateur.net',
    'notif-ouverture-sites': '!vOyjBSsOrxpfOdvrxN:dev01.tchap.incubateur.net',
} as const;

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
 * Résout la clé logique d'un salon vers son room ID Matrix réel, en basculant
 * systématiquement vers le salon de test en environnement de développement
 * (pour éviter de polluer les vrais salons de notification pendant les tests locaux).
 */
const resolveNotifChannel = (channelKey: TchapChannelKey): string => {
    if (config.environnement === 'development') {
        return TCHAP_CHANNELS['notif-dev-test'];
    }
    return TCHAP_CHANNELS[channelKey];
};

/**
 * Résout un alias de salon (ou retourne le roomId tel quel s'il ne commence pas par #).
 * Retourne null si la résolution échoue.
 */
const resolveRoomId = async (channel: string): Promise<string | null> => {
    if (!tchap) {
        return null;
    }

    let roomId = channel;
    let roomAlias = channel;

    if (roomId.startsWith('#')) {
        if (tchap.privateSpace) {
            roomAlias = `#${tchap.privateSpace}_${channel.substring(1)}`;
        }

        // Si l'alias ne contient pas de serveur (ex: #nom-salon), on formate l'alias complet Tchap
        if (!roomAlias.includes(':') && tchap.domain) {
            roomAlias = `${roomAlias}:${tchap.domain}`;
        }

        // Résolution de l'alias vers l'ID du salon via Matrix API
        try {
            const aliasReq = await fetch(`${tchap.baseUrl}/_matrix/client/v3/directory/room/${encodeURIComponent(roomAlias)}`);
            if (aliasReq.ok) {
                const aliasData = (await aliasReq.json()) as { room_id: string };
                roomId = aliasData.room_id;
            } else {
                Sentry.captureMessage(`[Tchap] Impossible de résoudre l'alias ${roomAlias}`, {
                    level: 'warning',
                });
                return null;
            }
        } catch {
            Sentry.captureMessage(`[Tchap] Erreur lors de la résolution de l'alias ${roomAlias}`, {
                level: 'warning',
            });
            return null;
        }
    }

    return roomId;
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
        let content = field.text;
        if (field.suffix) {
            content += field.suffix;
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
${levelEmoji} ${notification.text}${fieldsPlainText}`;
};

/**
 * Envoie un événement Matrix (message) dans un salon donné.
 * Fonction interne utilisée par sendHtmlMessage.
 *
 * @param roomId - Identifiant Matrix du salon (déjà résolu, format !xxx:domain)
 * @param payload - Contenu du message au format Matrix (msgtype, body, format, formatted_body, etc.)
 * @returns La Response finale ou null si le token Tchap n'est pas configuré
 */
const sendMatrixEvent = async (roomId: string, payload: Record<string, unknown>): Promise<Response | null> => {
    if (!tchap?.token) {
        Sentry.captureMessage('[Tchap] Impossible d\'envoyer le message : token Tchap non configuré', {
            level: 'error',
        });
        return null;
    }

    const txnId = `req_${Date.now()}_${randomUUID()}`;
    const sendUrl = `${tchap.baseUrl}/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/send/m.room.message/${txnId}`;

    return fetch(sendUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tchap.token}`,
        },
        body: JSON.stringify(payload),
    });
};

/**
 * Envoie un message HTML natif dans un salon Tchap/Matrix.
 * Fonction dédiée pour construire directement du HTML sans passer par Markdown.
 * Gère automatiquement le retry en cas de token expiré (401).
 */
const sendHtmlMessage = async (channel: string, html: string, plainTextFallback: string): Promise<void> => {
    // Si pas de config Tchap ou pas de canal spécifié, on abandonne
    if (!tchap || !channel) {
        return;
    }

    try {
        // 1. Résolution du roomId
        const roomId = await resolveRoomId(channel);
        if (!roomId) {
            return;
        }

        // 2. Construction du payload Matrix avec HTML natif
        const payload = {
            msgtype: 'm.text',
            body: plainTextFallback,
            format: 'org.matrix.custom.html',
            formatted_body: html,
        };

        // 3. Envoi via la fonction partagée
        const response = await sendMatrixEvent(roomId, payload);

        // 4. Gestion des erreurs
        if (!response) {
            Sentry.captureMessage('[Tchap] Impossible d\'envoyer le message HTML : token Tchap non configuré', {
                level: 'error',
                extra: { channel, roomId },
            });
            return;
        }

        if (!response.ok) {
            Sentry.captureMessage(`[Tchap] Échec d'envoi (${response.status} ${response.statusText})`, {
                level: 'warning',
                extra: { channel, roomId },
            });
        }
    } catch (error) {
        Sentry.captureException(error, {
            extra: { channel, html, plainTextFallback },
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
    if (!tchap) {
        return;
    }

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
    if (!tchap) {
        return;
    }

    const notifChannel = resolveNotifChannel('notif-nettoyage-piecesjointes');

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
    if (!tchap) {
        return;
    }

    const notifChannel = resolveNotifChannel('notif-nettoyage-piecesjointes');

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
    if (!tchap) {
        return;
    }

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
    if (!tchap) {
        return;
    }

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
    if (!tchap) {
        return;
    }

    const notifChannel = resolveNotifChannel('notif-requetes-cadastre');

    const userFullName = `${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}`;
    const userProfileUrl = `${webappUrl}/acces/${user.id}`;
    const locationText = checkLocation(user);

    const text = `Demande d'information cadastre de: <a href="${userProfileUrl}">${userFullName}</a> ${user.email}`;

    const fields: NotificationField[] = [
        {
            label: 'Territoire de rattachement',
            text: escapeHtml(locationText),
        },
        {
            label: 'Organisation',
            text: escapeHtml(user.organization.name),
        },
        {
            label: 'Fonction',
            text: escapeHtml(user.position),
        },
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
    if (!tchap) {
        return;
    }

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
    if (!tchap) {
        return;
    }

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
    if (!tchap) {
        return;
    }

    const notifChannel = resolveNotifChannel('notif-nouveaux-utilisateurs');

    const userFullName = `${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}`;
    const userProfileUrl = `${webappUrl}/acces/${user.id}`;
    const locationText = checkLocation(user);

    // Texte principal de la notification
    const text = `Nouvel utilisateur: <a href="${userProfileUrl}">${userFullName}</a> ${user.email}`;

    // Construction des champs de notification
    const fields: NotificationField[] = [
        {
            label: 'Territoire de rattachement',
            text: escapeHtml(locationText),
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
    if (!tchap) {
        return;
    }

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
    if (!tchap) {
        return;
    }

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
    if (!tchap) {
        return;
    }

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
    if (!tchap) {
        return;
    }

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
    if (!tchap) {
        return;
    }

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
    if (!tchap) {
        return;
    }

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
    if (!tchap) {
        return false;
    }

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
    if (!tchap) {
        return;
    }

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
    if (!tchap) {
        return;
    }

    const notifChannel = resolveNotifChannel('notif-reinstallation');

    const townName = escapeHtml(town.name || town.usename);
    const townUrl = `${webappUrl}/site/${town.id}`;
    const userFullName = `${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}`;
    const userProfileUrl = `${webappUrl}/acces/${user.id}`;

    const text = `Réinstallation signalée sur le site "<a href="${townUrl}">${townName}</a>" par <a href="${userProfileUrl}">${userFullName}</a>`;

    // Construction du message des sites d'origine (liste HTML)
    let incomingTownsHtml: string;
    if (town.reinstallationIncomingTowns.length > 0) {
        const townLinks = town.reinstallationIncomingTowns
            .map(({ id, usename }) => `<a href="${webappUrl}/site/${id}">${escapeHtml(usename)}</a>`)
            .join('<br/>');
        incomingTownsHtml = `Le(s) site(s) suivant(s) ont été désigné(s) comme origine(s) de la réinstallation:<br/>${townLinks}`;
    } else {
        incomingTownsHtml = 'Aucun site n\'a été désigné comme origine de la réinstallation';
    }

    const fields: NotificationField[] = [
        {
            label: 'Nombre d\'habitants',
            text: escapeHtml(String(town.populationTotal || 'Nombre inconnu')),
        },
        {
            label: 'Sites d\'origine',
            text: incomingTownsHtml,
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
    if (!tchap) {
        return;
    }

    const notifChannel = resolveNotifChannel('notif-ouverture-sites');

    const townName = escapeHtml(town.name || town.usename);
    const townUrl = `${webappUrl}/site/${town.id}`;
    const userFullName = `${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}`;
    const userProfileUrl = `${webappUrl}/acces/${user.id}`;

    const text = `Site ouvert "<a href="${townUrl}">${townName}</a>" par <a href="${userProfileUrl}">${userFullName}</a>`;

    // Construction du message des sites d'origine (liste HTML)
    let incomingTownsHtml: string;
    if (town.reinstallationIncomingTowns.length > 0) {
        const townLinks = town.reinstallationIncomingTowns
            .map(({ id, usename }) => `<a href="${webappUrl}/site/${id}">${escapeHtml(usename)}</a>`)
            .join('<br/>');
        incomingTownsHtml = `Le(s) site(s) suivant(s) ont été désigné(s) comme origine(s) de la réinstallation:<br/>${townLinks}`;
    } else {
        incomingTownsHtml = 'Aucun site n\'a été désigné comme origine de la réinstallation';
    }

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
            text: incomingTownsHtml,
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
