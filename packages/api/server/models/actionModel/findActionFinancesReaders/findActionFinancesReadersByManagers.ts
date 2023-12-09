import { Organization } from '#root/types/resources/Organization.d';
import findActionFinancesReaders from './findActionFinancesReaders';

export default async (managers: number[]): Promise<Organization[]> => findActionFinancesReaders(null, managers);
