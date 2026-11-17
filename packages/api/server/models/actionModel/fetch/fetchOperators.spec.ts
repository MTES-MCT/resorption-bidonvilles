import expectAnonymizedUsersExcluded from '#test/utils/actionModelAnonymizedUsersFetch';

describe('models/actionModel/fetch/fetchOperators()', () => {
    it('exclut les opérateurs dont le compte est anonymisé (traités comme des utilisateurs inexistants)', async () => {
        await expectAnonymizedUsersExcluded(
            '#server/models/actionModel/fetch/fetchOperators',
            '#server/models/actionModel/fetch/enrichWhere',
        );
    });
});
