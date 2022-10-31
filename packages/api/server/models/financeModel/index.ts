import create from './create';
import deleteFinance from './delete';

export default () => ({
    create,
    delete: deleteFinance,
});
