import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
const { expect } = chai;

export interface AnonymizedUsersFetchStub {
    sandbox: sinon.SinonSandbox;
    queryStub: sinon.SinonStub;
    fakeSequelize: { query: sinon.SinonStub };
}

// Ne fait aucun appel à rewiremock ici : `.with()` doit être invoqué depuis le
// fichier de test lui-même, sinon rewiremock lève une "isolation breach".
export function createAnonymizedUsersFetchStub(): AnonymizedUsersFetchStub {
    const sandbox = sinon.createSandbox();
    const queryStub = sandbox.stub();
    const fakeSequelize = {
        query: queryStub,
    };

    return { sandbox, queryStub, fakeSequelize };
}

export function registerAnonymizedUsersFetchHooks({ sandbox, queryStub }: Pick<AnonymizedUsersFetchStub, 'sandbox' | 'queryStub'>): void {
    beforeEach(() => {
        queryStub.resolves([]);
    });

    afterEach(() => {
        sandbox.reset();
    });
}

export async function expectAnonymizedUsersExcluded(
    queryStub: sinon.SinonStub,
    fetch: (ids: number[]) => Promise<unknown>,
): Promise<void> {
    await fetch([1]);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(queryStub).to.have.been.calledOnce;
    const sql: string = queryStub.firstCall.args[0];
    expect(sql).to.include('users.anonymized_at IS NULL');
}
