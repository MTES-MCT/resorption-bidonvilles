import actionFinanceTypeModel from '#server/models/actionFinanceTypeModel/index';
import actorThemes from '#server/config/shantytown_actor_themes';
import changelogModel from '#server/models/changelogModel/index';
import charteEngagementModel from '#server/models/charteEngagementModel/index';
import closingSolutionModel from '#server/models/closingSolutionModel/index';
import commentTagModel from '#server/models/commentTagModel/index';
import config from '#server/config';
import departementModel from '#server/models/departementModel/index';
import electricityTypeModel from '#server/models/electricityTypeModel/index';
import expertiseTopicModel from '#server/models/expertiseTopicsModel/index';
import fieldTypeModel from '#server/models/fieldTypeModel/index';
import ownerTypeModel from '#server/models/ownerTypeModel/index';
import permissionsDescription from '#server/permissions_description';
import questionTagModel from '#server/models/questionTagModel/index';
import regionModel from '#server/models/regionModel/index';
import socialOriginsModel from '#server/models/socialOriginModel/index';
import topicModel from '#server/models/topicModel/index';
import userModel from '#server/models/userModel/index';

import ServiceError from '#server/errors/ServiceError';
import { ConfigServiceFetchResponse } from '#root/types/services/ConfigService.d';
import { User } from '#root/types/resources/User.d';

export default async (user: User): Promise<ConfigServiceFetchResponse> => {
    try {
        const [
            actionFinanceTypes,
            changelog,
            closingSolutions,
            commentTags,
            departements,
            electricityTypes,
            expertiseTopics,
            extendedUser,
            fieldTypes,
            latestCharte,
            ownerTypes,
            questionTags,
            regions,
            socialOrigins,
            topics,
        ] = await Promise.all([
            actionFinanceTypeModel.findAll(),
            changelogModel.getChangelogFor(user),
            closingSolutionModel.findAll(),
            commentTagModel.find({}),
            departementModel.findAll(),
            electricityTypeModel.findAll(),
            expertiseTopicModel.findAll(),
            userModel.findOne(user.id, { extended: true }),
            fieldTypeModel.findAll(),
            charteEngagementModel.getLatest(),
            ownerTypeModel.findAll(),
            questionTagModel.findAll(),
            regionModel.findAll(),
            socialOriginsModel.findAll(),
            topicModel.findAll(),
        ]);

        return {
            action_finance_types: actionFinanceTypes,
            activation_token_expires_in: parseInt(config.activationTokenExpiresIn, 10) * 3600,
            actor_themes: actorThemes,
            changelog,
            closing_solutions: closingSolutions,
            departements,
            electricity_types: electricityTypes,
            expertise_topics: expertiseTopics,
            field_types: fieldTypes,
            owner_types: ownerTypes,
            permissions_description: permissionsDescription,
            question_tags: questionTags,
            regions,
            regular_comment_tags: commentTags,
            social_origins: socialOrigins,
            topics,
            user: extendedUser,
            version_charte_engagement: latestCharte,
        };
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
};