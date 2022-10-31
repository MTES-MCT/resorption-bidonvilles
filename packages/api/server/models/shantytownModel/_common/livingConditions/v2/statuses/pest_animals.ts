import computeStatus from './computeStatus';
import presence from './pest_animals/presence';

export default town => computeStatus(town, {
    presence,
});
