import computeStatus from './computeStatus';
import access from './electricity/access';
import accessTypes from './electricity/access_types';
import accessIsUnequal from './electricity/access_is_unequal';

export default town => computeStatus(town, {
    access,
    accessTypes,
    accessIsUnequal,
});
