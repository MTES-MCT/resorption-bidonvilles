import { Organization } from '#root/types/resources/Organization.d';
import findJusticeReaders from './findJusticeReaders';

export default async (userId: number): Promise<Organization[]> => findJusticeReaders(null, null, userId);
