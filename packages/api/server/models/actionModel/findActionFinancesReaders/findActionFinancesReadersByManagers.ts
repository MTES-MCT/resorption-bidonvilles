import { Departement } from '#server/models/geoModel/Location.d';
import { Organization } from '#root/types/resources/Organization.d';
import findActionFinancesReaders from './findActionFinancesReaders';

export default async (departement: Departement, managers: number[]): Promise<Organization[]> => findActionFinancesReaders(null, managers, departement);
