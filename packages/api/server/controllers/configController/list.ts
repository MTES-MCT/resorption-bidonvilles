import permissionsDescription from '#server/permissions_description';
import config from '#server/config';
import themes from '#server/config/shantytown_actor_themes';

import userModelFactory from '#server/models/userModel';
import closingSolutionModelFactory from '#server/models/closingSolutionModel';
import socialOriginModelFactory from '#server/models/socialOriginModel';
import fieldTypeModelFactory from '#server/models/fieldTypeModel';
import ownerTypeModelFactory from '#server/models/ownerTypeModel';
import departementModelFactory from '#server/models/departementModel';
import regionModelFactory from '#server/models/regionModel';
import etpTypeModelFactory from '#server/models/etpTypeModel';
import financeTypeModelFactory from '#server/models/financeTypeModel';
import planCategoryModelFactory from '#server/models/planCategoryModel';
import topicModelFactory from '#server/models/topicModel';
import electricityTypeModelFactory from '#server/models/electricityTypeModel';
import changelogModelFactory from '#server/models/changelogModel';
import charteEngagementModelFactory from '#server/models/charteEngagementModel';
import commentTagModelFactory from '#server/models/commentTagModel';

const { activationTokenExpiresIn } = config;
const userModel = userModelFactory();
const closingSolutionModel = closingSolutionModelFactory();
const socialOriginModel = socialOriginModelFactory();
const fieldTypeModel = fieldTypeModelFactory();
const ownerTypeModel = ownerTypeModelFactory();
const departementModel = departementModelFactory();
const regionModel = regionModelFactory();
const topicModel = topicModelFactory();
const electricityTypeModel = electricityTypeModelFactory();
const etpTypeModel = etpTypeModelFactory();
const financeTypeModel = financeTypeModelFactory();
const planCategoryModel = planCategoryModelFactory();
const changelogModel = changelogModelFactory();
const charteEngagementModel = charteEngagementModelFactory();
const commentTagModel = commentTagModelFactory();

export default async (req, res, next) => {
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
        regular_comment_tags: commentTagModel.find({ types: ['regular'] }),
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
