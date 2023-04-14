import { SerializedOrganization } from '#server/models/userModel/getDirectory';
import findActionFinancesReaders from './findActionFinancesReaders';

export default async (managers: number[]): Promise<SerializedOrganization[]> => findActionFinancesReaders(null, managers);
