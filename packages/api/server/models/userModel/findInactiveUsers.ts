import config from '#server/config';
import { Op, literal } from 'sequelize';
import { sequelize } from '#db/sequelize';
import query from './_common/query';

const { inactivityAlert: { delayBeforeAlert } } = config;
type SequelizeQueryGenerator = {
    getWhereConditions: Function
};

const queryGenerator: SequelizeQueryGenerator = sequelize.getQueryInterface().queryGenerator as SequelizeQueryGenerator;

export default () => query(
    queryGenerator.getWhereConditions({
        [Op.and]: [
            { to_be_tracked: true },
            { fk_status: 'active' },
            { inactivity_alert_sent_at: null },
            {
                [Op.or]: [
                    {
                        [Op.and]: [
                            { last_access: { [Op.ne]: null } },
                            sequelize.where(sequelize.fn('NOW'), {
                                [Op.gt]: literal(`${sequelize.escape(delayBeforeAlert)} + users.last_access`),
                            }),
                        ],
                    },
                    {
                        [Op.and]: [
                            { last_access: { [Op.is]: null } },
                            sequelize.where(sequelize.fn('NOW'), {
                                [Op.gt]: literal(`${sequelize.escape(delayBeforeAlert)} + users.created_at`),
                            }),
                        ],
                    },
                ],
            },
        ],
    }),
);
