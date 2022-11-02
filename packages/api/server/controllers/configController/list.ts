import permissionsDescription from '#server/permissions_description';
import config from '#server/config';
import themes from '#server/config/shantytown_actor_themes';

import userModel from '#server/models/userModel';
import closingSolutionModel from '#server/models/closingSolutionModel';
import socialOriginModel from '#server/models/socialOriginModel';
import fieldTypeModel from '#server/models/fieldTypeModel';
import ownerTypeModel from '#server/models/ownerTypeModel';
import departementModel from '#server/models/departementModel';
import regionModel from '#server/models/regionModel';
import etpTypeModel from '#server/models/etpTypeModel';
import financeTypeModel from '#server/models/financeTypeModel';
import planCategoryModel from '#server/models/planCategoryModel';
import topicModel from '#server/models/topicModel';
import electricityTypeModel from '#server/models/electricityTypeModel';
import changelogModel from '#server/models/changelogModel';
import charteEngagementModel from '#server/models/charteEngagementModel';
import commentTagModel from '#server/models/commentTagModel';

const { activationTokenExpiresIn } = config;

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
