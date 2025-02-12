import shantytownDecreeModel from '#server/models/shantytownDecreeModel';
import { ShantytownDecree } from '#server/models/shantytownDecreeModel/shantytownDecrees.d';
import { User } from '#root/types/resources/User.d';

export default async (user: User, townId: number | number[]) => {
    const shantytownDecrees: ShantytownDecree[] = await shantytownDecreeModel.findAll(townId);

    return shantytownDecrees;
};
