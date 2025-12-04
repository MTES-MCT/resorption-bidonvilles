const { Op, col } = require('sequelize');

function lessOrEqualColumnOrNull(leftField, rightField = 'nombre_mineurs') {
    return {
        [Op.or]: [
            { [rightField]: { [Op.eq]: null } },
            { [leftField]: { [Op.eq]: null } },
            {
                [rightField]: { [Op.ne]: null },
                [leftField]: {
                    [Op.ne]: null,
                    [Op.lte]: col(rightField),
                },
            },
        ],
    };
}

module.exports = {
    lessOrEqualColumnOrNull,
};
