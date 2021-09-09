const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    /** *********************************************************************************************
     * SCHEMA
     ********************************************************************************************* */

    const Stats_Exports = sequelize.define('Stats_Exports', {
        /**
         * Whether the scope of the export was closed shantytowns or opened
         */
        closed_shantytowns: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        /**
         * @foreign_key fk_statsExports_region
         * @constraint check_location
         */
        fk_region: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        /**
         * @foreign_key fk_statsExports_departement
         * @constraint check_location
         */
        fk_departement: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        /**
         * @foreign_key fk_statsExports_epci
         * @constraint check_location
         */
        fk_epci: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        /**
         * @foreign_key fk_statsExports_city
         * @constraint check_location
         */
        fk_city: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        /**
         * The user who made the export
         * @foreign_key fk_statsExports_exportedBy
         */
        exported_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        /**
         * Date and time of the export
         */
        created_at: {
            type: DataTypes.DATE,
            defaultValue: sequelize.NOW,
        },

        /**
         * Mandatory field but useless for us here
         */
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
            // onUpdate: sequelize.NOW
        },
    }, {
        sequelize,
        tableName: 'stats_exports',
        underscored: true,
        paranoid: false,
        timestamps: true,
    });
    Stats_Exports.removeAttribute('id');

    return Stats_Exports;
};
