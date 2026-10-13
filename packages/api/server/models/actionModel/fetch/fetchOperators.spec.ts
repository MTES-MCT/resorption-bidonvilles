import { rewiremock } from '#test/rewiremock';
import {
    createAnonymizedUsersFetchStub,
    registerAnonymizedUsersFetchHooks,
    expectAnonymizedUsersExcluded,
} from '#test/utils/actionModelAnonymizedUsersFetch';

const { sandbox, queryStub, fakeSequelize } = createAnonymizedUsersFetchStub();

rewiremock('#db/sequelize').with({ sequelize: fakeSequelize });
rewiremock('sequelize').with({ QueryTypes: { SELECT: 'SELECT' } });
rewiremock('./enrichWhere').callThrough();

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import fetchOperators from './fetchOperators';
rewiremock.disable();

describe('models/actionModel/fetch/fetchOperators()', () => {
    registerAnonymizedUsersFetchHooks({ sandbox, queryStub });

    it('exclut les opérateurs dont le compte est anonymisé (traités comme des utilisateurs inexistants)', async () => {
        await expectAnonymizedUsersExcluded(queryStub, fetchOperators);
    });
});
