import permissionUtils from '#server/utils/permission';
import { Location } from '#server/models/geoModel/Location.d';
import { User } from '#root/types/resources/User.d';

export default (user: User, location: Location, isPastExport: boolean): Location[] => permissionUtils
    .restrict(location)
    .for(user)
    .askingTo('export', isPastExport ? 'shantytown_history' : 'shantytown');
