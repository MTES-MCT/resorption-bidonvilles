import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
export default (filters: any = {}) => {
    const where = [];
    const replacements: any = {};

    if (filters.ids) {
        where.push('comment_tags.uid IN (:ids)');
        replacements.ids = filters.ids;
    }

    if (filters.types) {
        where.push('fk_comment_tag_type IN (:types)');
        replacements.types = filters.types;
    }

    return sequelize.query(
        `SELECT
            comment_tags.uid AS uid,
            comment_tags.tag AS label
        FROM comment_tags
        ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}`,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );
};
