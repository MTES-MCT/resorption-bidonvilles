import expectAnonymizedUsersExcluded from '#test/utils/actionModelAnonymizedUsersFetch';

describe('models/actionModel/fetchByShantytown/fetchOperators()', () => {
    it('exclut les opérateurs dont le compte est anonymisé (traités comme des utilisateurs inexistants)', async () => {
        await expectAnonymizedUsersExcluded(
            '#server/models/actionModel/fetchByShantytown/fetchOperators',
            '#server/models/actionModel/fetch/enrichWhere',
        );
    });
});
