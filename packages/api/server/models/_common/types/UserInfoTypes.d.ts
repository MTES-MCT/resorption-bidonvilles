/**
 * Types réutilisables pour les informations d'utilisateur et d'organisation
 * dans les requêtes SQL du modèle Action
 */

/**
 * Informations de base d'un utilisateur (créateur ou éditeur)
 */
export type UserInfo = {
    id: number,
    first_name: string,
    last_name: string,
    organization_id: number,
    organization_name: string,
    organization_abbreviation: string | null,
};

/**
 * Informations de créateur (toujours présentes)
 */
export type CreatorInfo = {
    creator_id: number,
    creator_first_name: string,
    creator_last_name: string,
    creator_organization_id: number,
    creator_organization_name: string,
    creator_organization_abbreviation: string | null,
    created_at: Date,
};

/**
 * Informations d'éditeur (optionnelles)
 */
export type EditorInfo = {
    editor_id: number | null,
    editor_first_name: string | null,
    editor_last_name: string | null,
    editor_organization_id: number | null,
    editor_organization_name: string | null,
    editor_organization_abbreviation: string | null,
    updated_at: Date,
};

/**
 * Combinaison créateur + éditeur (pour les entités complètes)
 */
export type AuditInfo = CreatorInfo & EditorInfo;
