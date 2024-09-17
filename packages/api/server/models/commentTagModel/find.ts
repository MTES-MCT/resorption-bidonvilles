import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { ShantytownCommentTag } from '#root/types/resources/ShantytownCommentTag.d';

type CommentTagFilters = { ids?: number[] };

export default (filters: CommentTagFilters = {}): Promise<ShantytownCommentTag[]> => {
    const where: string[] = [];
    const replacements: { [key: string]: any } = {};

    if (filters.ids) {
        where.push('comment_tags.uid IN (:ids)');
        replacements.ids = filters.ids;
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
