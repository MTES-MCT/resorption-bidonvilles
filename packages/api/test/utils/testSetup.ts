import sinon from 'sinon';

/**
 * Helper pour configurer le stub console.error dans les tests
 *
 * Usage:
 * ```typescript
 * describe('My test suite', () => {
 *     const { setupConsoleErrorStub } = createTestSetup(sandbox);
 *
 *     beforeEach(() => {
 *         setupConsoleErrorStub();
 *     });
 * });
 * ```
 */
export function createTestSetup(sandbox: sinon.SinonSandbox) {
    let consoleErrorStub: sinon.SinonStub | null = null;

    return {
        /**
         * Configure le stub pour console.error
         * À appeler dans beforeEach
         */
        setupConsoleErrorStub: () => {
            consoleErrorStub = sandbox.stub(console, 'error');
            return consoleErrorStub;
        },

        /**
         * Restaure le stub console.error
         * À appeler dans afterEach
         */
        restoreConsoleErrorStub: () => {
            if (consoleErrorStub) {
                consoleErrorStub.restore();
                consoleErrorStub = null;
            }
        },

        /**
         * Récupère le stub console.error actuel
         */
        getConsoleErrorStub: () => consoleErrorStub,
    };
}

/**
 * Helper pour configurer une transaction de test
 *
 * Usage:
 * ```typescript
 * const { setupTransaction, getTransaction } = createTransactionSetup(sandbox, sequelize);
 *
 * beforeEach(() => {
 *     setupTransaction();
 * });
 * ```
 */
export function createTransactionSetup(
    sandbox: sinon.SinonSandbox,
    sequelize: { transaction: sinon.SinonStub },
) {
    let transaction: {
        commit: sinon.SinonStub;
        rollback: sinon.SinonStub;
    } | null = null;

    return {
        /**
         * Configure une transaction de test
         * À appeler dans beforeEach
         */
        setupTransaction: () => {
            transaction = {
                commit: sandbox.stub(),
                rollback: sandbox.stub(),
            };
            sequelize.transaction.withArgs().resolves(transaction);
            return transaction;
        },

        /**
         * Récupère la transaction actuelle
         */
        getTransaction: () => transaction,
    };
}
