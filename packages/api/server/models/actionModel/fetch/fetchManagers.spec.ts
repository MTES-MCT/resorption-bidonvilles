import expectAnonymizedUsersExcluded from '#test/utils/actionModelAnonymizedUsersFetch';

describe('models/actionModel/fetch/fetchManagers()', () => {
    it('exclut les pilotes dont le compte est anonymisé (traités comme des utilisateurs inexistants)', async () => {
        await expectAnonymizedUsersExcluded(
            '#server/models/actionModel/fetch/fetchManagers',
            '#server/models/actionModel/fetch/enrichWhere',
        );
    });
});
