import findByIds from './findByIds';
import { Organization } from '#root/types/resources/Organization.d';

export default async (id: number): Promise<Organization | null> => {
    const result = await findByIds([id]);
    return result.length === 1 ? result[0] : null;
};
