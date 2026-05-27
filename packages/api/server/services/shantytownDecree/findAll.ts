import shantytownDecreeModel from '#server/models/shantytownDecreeModel';
import { ShantytownDecree } from '#server/models/shantytownDecreeModel/shantytownDecrees.d';

export default async function findAll(townId: number | number[]) {
    const shantytownDecrees: ShantytownDecree[] = await shantytownDecreeModel.findAll(townId);

    return shantytownDecrees;
}
