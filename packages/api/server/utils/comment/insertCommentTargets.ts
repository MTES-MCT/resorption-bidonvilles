import { type Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

type CommentTarget = {
    id: number,
};

interface CommentTargets {
    users?: CommentTarget[];
    organizations?: CommentTarget[];
}

interface CommentTargetsTables {
    userTargetsTable: string;
    organizationTargetsTable: string;
}

export const insertCommentTargets = async (
    commentId: number,
    targets: CommentTargets,
    tables: CommentTargetsTables,
    transaction?: Transaction,
): Promise<void> => {
    const promises = [];

    if (targets.users && targets.users.length > 0) {
        promises.push(
            sequelize.getQueryInterface().bulkInsert(
                tables.userTargetsTable,
                targets.users.map(user => ({
                    fk_user: user.id,
                    fk_comment: commentId,
                })),
                { transaction },
            ),
        );
    }

    if (targets.organizations && targets.organizations.length > 0) {
        promises.push(
            sequelize.getQueryInterface().bulkInsert(
                tables.organizationTargetsTable,
                targets.organizations.map(organization => ({
                    fk_organization: organization.id,
                    fk_comment: commentId,
                })),
                { transaction },
            ),
        );
    }

    if (promises.length > 0) {
        await Promise.all(promises);
    }
};

export default insertCommentTargets;
