module.exports = {
    addForeignKey: (queryInterface, {
        table,
        fields,
        refTable,
        refField,
        onUpdate,
        onDelete,
        transaction,
    }) => queryInterface.addConstraint(table, {
        fields,
        type: 'foreign key',
        name: `fk__${table}__${refTable}`,
        references: {
            table: `${refTable}`,
            field: `${refField}`,
        },
        onUpdate: `${onUpdate}`,
        onDelete: `${onDelete}`,
        transaction,
    }),

    removeForeignKey: (queryInterface, { table, refTable, transaction }) => queryInterface.removeConstraint(
        `${table}`,
        `fk__${table}__${refTable}`,
        { transaction },
    ),
};
