import { User } from '#root/types/resources/User.d';
import { LocationType } from '../geoModel/LocationType';
import getLocalAdminsForDepartement from './_common/getLocalAdminsForDepartement';
import getNationalAdmins from './_common/getNationalAdmins';

export default async (user: User): Promise<User[]> => {
    const admins: User[] = [];
    const mainAreas = user.intervention_areas.areas.filter(area => area.is_main_area);
    const types: LocationType[] = mainAreas.map(area => area.type);

    // si l'utilisateur est lié à au moins un département, on prévient les administrateurs de ce/ces départements
    if (types.includes('city') || types.includes('departement') || types.includes('epci')) {
        admins.push(
            ...await getLocalAdminsForDepartement(
                mainAreas.filter(area => area.departement !== null).map(area => area.departement.code),
            ),
        );
    }

    // si l'utilisateur est lié à une région, au national, ou qu'aucun admin local n'a été trouvé, on prévient les admins nationaux
    if (types.includes('nation') || types.includes('region') || admins.length === 0) {
        admins.push(
            ...await getNationalAdmins(),
        );
    }

    return admins;
};
