import { SerializedOrganization } from '#server/models/userModel/getDirectory';
import findActionFinancesReaders from './findActionFinancesReaders';

export default async (actionId: number): Promise<SerializedOrganization[]> => findActionFinancesReaders(actionId);
