import { Location } from '#server/models/geoModel/Location.d';
import { Organization } from '#root/types/resources/Organization.d';
import findJusticeReaders from './findJusticeReaders';

export default async (location: Location): Promise<Organization[]> => findJusticeReaders(null, location);
