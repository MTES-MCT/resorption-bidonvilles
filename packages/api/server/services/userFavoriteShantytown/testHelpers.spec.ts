import chai from 'chai';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;

/**
 * Helper pour tester qu'une fonction rejette avec permission_denied pour les rôles interdits
 */
export async function expectPermissionDenied(
    fn: () => Promise<void>,
    expectedCode = 'permission_denied',
): Promise<void> {
    let error: any;

    try {
        await fn();
    } catch (err) {
        error = err;
    }

    expect(error).to.be.an.instanceOf(ServiceError);
    expect(error.code).to.equal(expectedCode);
}

/**
 * Helper pour tester qu'une fonction ne throw pas et retourne undefined
 */
export async function expectVoidReturn(fn: () => Promise<void>): Promise<void> {
    const result = await fn();
    expect(result).to.be.undefined;
}
