module.exports = tag => Object.assign(
    {
        uid: tag.tagId,
        label: tag.tagLabel,
        tagType: {
            uid: tag.tagTypeId,
            label: tag.tagTypeLabel,
        },
    },
);
