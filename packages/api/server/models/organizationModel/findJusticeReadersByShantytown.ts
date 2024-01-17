import { Organization } from '#root/types/resources/Organization.d';
import findJusticeReaders from './findJusticeReaders';

export default async (shantytownId: number): Promise<Organization[]> => findJusticeReaders(shantytownId);
