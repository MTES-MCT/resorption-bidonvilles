module.exports = comment => Object.assign(
    {
        id: comment.commentId,
        description: comment.commentDescription,
        createdAt: comment.commentCreatedAt !== null ? (comment.commentCreatedAt.getTime() / 1000) : null,
        createdBy: {
            id: comment.commentCreatedBy,
            first_name: comment.userFirstName,
            last_name: comment.userLastName,
            role: comment.userRole,
            position: comment.userPosition,
            organization: comment.organizationAbbreviation || comment.organizationName,
            organization_id: comment.organizationId,
        },
        plan: comment.planId,
    },
);
