const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    /** *********************************************************************************************
     * SCHEMA
     ********************************************************************************************* */

    class Schema extends Model { }
    Schema.init({
        /**
         * Organization viewed
         * @foreign_key fk_statsDirectoryViews_organization
         */
        organization: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        /**
         * User who viewed the directory
         * @foreign_key fk_statsDirectoryViews_viewedBy
         */
        viewed_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        /**
         * Date and time of the event
         */
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
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
        tableName: 'stats_directory_views',
        underscored: true,
        paranoid: false,
        timestamps: true,
    });
    Schema.removeAttribute('id');


    class Stats_Directory_Views extends Schema {
        /** *****************************************************************************************
         * CUSTOM METHODS
         ***************************************************************************************** */

        // none

        /** *****************************************************************************************
         * ASSOCIATIONS
         ***************************************************************************************** */

        /**
         * Creates the proper associations between this model and others
         *
         * @param {Object.<String,Model>} models
         *
         * @returns {undefined}
         */
        static associate(models) {
            // none defined
        }
    }

    // The End
    return Stats_Directory_Views;
};
