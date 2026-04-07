import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import { CreatorInfo, EditorInfo } from '#server/models/_common/types/UserInfoTypes.d';
import ActionLocationType from '#root/types/resources/ActionLocationType.d';
import enrichWhere from './enrichWhere';

export type ActionSelectRow = {
    action_id: number,
    action_ref: string | null,
    name: string,
    started_at: string,
    ended_at: string | null,
    goals: string | null,
    departement_name: string,
    departement_code: string,
    region_name: string,
    region_code: string,
    location_type: ActionLocationType,
    location_other: string | null,
} & CreatorInfo & EditorInfo;

export default function fetchActions(actionIds: number[] = null, clauseGroup: object = {}, transaction?: Transaction): Promise<ActionSelectRow[]> {
    const where = [];
    const replacements = { actionIds };
    if (actionIds !== null) {
        where.push('actions.action_id IN (:actionIds)');
    }

    enrichWhere(where, replacements, clauseGroup);

    return sequelize.query(
        `SELECT
            actions.action_id,
            actions.action_ref,
            actions.name,
            actions.started_at,
            actions.ended_at,
            actions.goals,
            departements.name AS departement_name,
            departements.code AS departement_code,
            regions.name AS region_name,
            regions.code AS region_code,
            actions.location_type,
            actions.location_other,
            creator.user_id AS creator_id,
            creator.first_name AS creator_first_name,
            creator.last_name AS creator_last_name,
            creator_organizations.organization_id AS creator_organization_id,
            creator_organizations.name AS creator_organization_name,
            creator_organizations.abbreviation AS creator_organization_abbreviation,
            actions.created_at,
            editor.user_id AS editor_id,
            editor.first_name AS editor_first_name,
            editor.last_name AS editor_last_name,
            editor_organizations.organization_id AS editor_organization_id,
            editor_organizations.name AS editor_organization_name,
            editor_organizations.abbreviation AS editor_organization_abbreviation,
            actions.updated_at
        FROM actions
        LEFT JOIN departements ON actions.fk_departement = departements.code
        LEFT JOIN regions ON departements.fk_region = regions.code
        LEFT JOIN users AS creator ON actions.created_by = creator.user_id
        LEFT JOIN organizations AS creator_organizations ON creator.fk_organization = creator_organizations.organization_id
        LEFT JOIN users AS editor ON actions.updated_by = editor.user_id
        LEFT JOIN organizations AS editor_organizations ON editor.fk_organization = editor_organizations.organization_id
        ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
        `,
        {
            type: QueryTypes.SELECT,
            replacements,
            transaction,
        },
    );
}
