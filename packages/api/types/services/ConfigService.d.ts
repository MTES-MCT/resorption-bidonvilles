import { RolePermissionDescriptions } from '#server/permissions_description';
import { Role } from '#root/types/resources/Role.d';
import { ActionFinanceType } from '../resources/ActionFinance.d';
import { Changelog } from '../resources/Changelog.d';
import { CharteEngagement } from '../resources/CharteEngagement.d';
import { ClosingSolution } from '../resources/ClosingSolution.d';
import { Departement } from '../resources/Departement.d';
import { ElectricityType } from '../resources/ElectricityType.d';
import { ExpertiseTopic } from '../resources/ExpertiseTopic.d';
import { FieldType } from '../resources/FieldType.d';
import { OwnerType } from '../resources/OwnerType.d';
import { QuestionTag } from '../resources/Question.d';
import { Region } from '../resources/Region.d';
import { ShantytownCommentTag } from '../resources/ShantytownComment';
import { SocialOrigin } from '../resources/SocialOrigin.d';
import { Topic } from '../resources/Topic.d';
import { User } from '../resources/User.d';

export type ConfigServiceFetchResponse = {
    action_finance_types: ActionFinanceType[],
    activation_token_expires_in: number,
    actor_themes: {
        [key: string]: string,
    },
    changelog: Changelog[],
    closing_solutions: ClosingSolution[],
    departements: Departement[],
    electricity_types: ElectricityType[],
    expertise_topics: ExpertiseTopic[],
    field_types: FieldType[],
    owner_types: OwnerType[],
    permissions_description: RolePermissionDescriptions,
    question_tags: QuestionTag[],
    regions: Region[],
    comment_tags: ShantytownCommentTag[],
    social_origins: SocialOrigin[],
    topics: Topic[],
    user: User,
    version_charte_engagement: CharteEngagement,
    roles: Role[],
};
