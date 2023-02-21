import { Location } from '#server/models/geoModel/Location.d';
import { SerializedOrganization } from '#server/models/userModel/getDirectory';
import findJusticeReaders from './findJusticeReaders';

export default async (location: Location): Promise<SerializedOrganization[]> => findJusticeReaders(null, location);
