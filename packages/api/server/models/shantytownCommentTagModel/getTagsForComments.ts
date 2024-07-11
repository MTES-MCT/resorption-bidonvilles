import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import serializeCommentTag from './serializeCommentTag';
import { ShantytownCommentTag } from '#root/types/resources/ShantytownCommentTag.d';
import { CommentTagRow } from './CommentTagRow';


export type CommentTagObject = { [key: number]: ShantytownCommentTag[] };

export default async (commentIds): Promise<CommentTagObject> => {
    // fetch all tags
    const rows: CommentTagRow[] = await sequelize.query(
        `SELECT
            sct.fk_shantytown_comment AS "commentId",
            ct.uid,
            ct.tag
        FROM shantytown_comment_tags AS sct
        LEFT JOIN comment_tags AS ct ON ct.uid = sct.fk_comment_tag
        WHERE sct.fk_shantytown_comment IN (:ids)
        ORDER BY CONCAT(sct.fk_shantytown_comment, '-', sct.fk_comment_tag) ASC`,
        {
            type: QueryTypes.SELECT,
            replacements: { ids: commentIds },
        },
    );

    // group tags by comment (empty array is the default for each comment)

    return rows.reduce((argAcc, tag: CommentTagRow) => {
        const acc = { ...argAcc };
        if (!acc[tag.commentId]) {
            acc[tag.commentId] = [];
        }
        acc[tag.commentId].push(serializeCommentTag(tag));

        return acc;
    }, {});
};
