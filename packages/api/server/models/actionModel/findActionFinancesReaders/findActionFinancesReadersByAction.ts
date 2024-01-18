import { Organization } from '#root/types/resources/Organization.d';
import findActionFinancesReaders from './findActionFinancesReaders';

export default async (actionId: number): Promise<Organization[]> => findActionFinancesReaders(actionId);
