import { SerializedOrganization } from '#server/models/userModel/getDirectory';
import findJusticeReaders from './findJusticeReaders';

export default async (shantytownId: number): Promise<SerializedOrganization[]> => findJusticeReaders(shantytownId);
