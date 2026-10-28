import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';

chai.use(sinonChai);
const { expect } = chai;

// rewiremock exige que `.with()` et l'import du module testé soient faits par
// la même fonction appelante, sinon il lève une "isolation breach" : d'où un
// import() dynamique ici plutôt qu'un import statique dans chaque spec.
export default async function expectAnonymizedUsersExcluded(modulePath: string, enrichWherePath: string): Promise<void> {
    const sandbox = sinon.createSandbox();
    const queryStub = sandbox.stub().resolves([]);
    const fakeSequelize = { query: queryStub };

    rewiremock('#db/sequelize').with({ sequelize: fakeSequelize });
    rewiremock('sequelize').with({ QueryTypes: { SELECT: 'SELECT' } });
    rewiremock(enrichWherePath).callThrough();

    rewiremock.enable();
    const { default: fetch } = await import(modulePath);
    rewiremock.disable();

    await fetch([1]);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(queryStub).to.have.been.calledOnce;
    const sql: string = queryStub.firstCall.args[0];
    expect(sql).to.include('users.anonymized_at IS NULL');

    sandbox.restore();
}
