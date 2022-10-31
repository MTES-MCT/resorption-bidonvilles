import computeStatus from './computeStatus';
import diagnostic from './fire_prevention/diagnostic';

export default town => computeStatus(town, {
    diagnostic,
});
