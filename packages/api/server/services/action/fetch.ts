import actionModel from '#server/models/actionModel/index';
import Action from '#root/types/resources/Action.d';
import { User } from '#root/types/resources/User.d';

export default (user: User, actionIds: number[] = null): Promise<Action[]> => actionModel.fetch(user, actionIds);
