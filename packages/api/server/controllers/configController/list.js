const permissionsDescription = require('#server/permissions_description');
const { activationTokenExpiresIn } = require('#server/config');
const themes = require('#server/config/shantytown_actor_themes');
const userModel = require('#server/models/userModel');
const closingSolutionModel = require('#server/models/closingSolutionModel');
const socialOriginModel = require('#server/models/socialOriginModel');
const fieldTypeModel = require('#server/models/fieldTypeModel/index')();
const ownerTypeModel = require('#server/models/ownerTypeModel/index')();
const departementModel = require('#server/models/departementModel/index')();
const regionModel = require('#server/models/regionModel/index')();
const etpTypeModel = require('#server/models/etpTypeModel/index')();
const financeTypeModel = require('#server/models/financeTypeModel/index')();
const planCategoryModel = require('#server/models/planCategoryModel/index')();
const topicModel = require('#server/models/topicModel/index')();
const electricityTypeModel = require('#server/models/electricityTypeModel/index')();
const changelogModel = require('#server/models/changelogModel/index')();
const charteEngagementModel = require('#server/models/charteEngagementModel/index')();

module.exports = async (req, res, next) => {
    const queries = {
        field_types: fieldTypeModel.findAll(),
        owner_types: ownerTypeModel.findAll(),
        social_origins: socialOriginModel.findAll(),
        departements: departementModel.findAll(),
        regions: regionModel.findAll(),
        closing_solutions: closingSolutionModel.findAll(),
        etp_types: etpTypeModel.findAll(),
        finance_types: financeTypeModel.findAll(),
        plan_categories: planCategoryModel.findAll(),
        topics: topicModel.findAll(),
        electricity_types: electricityTypeModel.findAll(),
        permissions_description: permissionsDescription,
        user: userModel.findOne(req.user.id, { extended: true }),
        changelog: changelogModel.getChangelogFor(req.user),
        version_charte_engagement: charteEngagementModel.getLatest(),
        actor_themes: themes,
    };

    const promises = Object.values(queries);
    const names = Object.keys(queries);

    return Promise.all(promises)
        .then((results) => {
            const response = {
                activation_token_expires_in: parseInt(activationTokenExpiresIn, 10) * 3600,
            };
            names.forEach((name, index) => {
                response[name] = results[index];
            });

            return res.status(200).send(response);
        })
        .catch((error) => {
            res.status(500).send(error.message);
            next(error);
        });
};
