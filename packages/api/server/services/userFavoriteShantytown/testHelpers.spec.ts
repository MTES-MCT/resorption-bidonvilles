import chai from 'chai';
import ServiceError from '#server/errors/ServiceError';
import { serialized as fakeUser } from '#test/utils/user';

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

/**
 * Génère les tests de contrôle des permissions pour les rôles interdits
 */
export function testForbiddenRolesPermissions(
    serviceFn: (user: any, shantytownId: number) => Promise<void>,
    modelStub: sinon.SinonStub,
    shantytownId: number,
): void {
    const forbiddenRoles = ['intervener', 'external_observator'] as const;

    forbiddenRoles.forEach((roleId) => {
        it(`rejette avec permission_denied si l'utilisateur a le rôle ${roleId}`, async () => {
            const user = fakeUser({ role_id: roleId });
            await expectPermissionDenied(() => serviceFn(user, shantytownId));
        });

        it(`n'appelle pas le modèle si l'utilisateur a le rôle ${roleId}`, async () => {
            const user = fakeUser({ role_id: roleId });

            try {
                await serviceFn(user, shantytownId);
            } catch {
                // do nothing
            }

            expect(modelStub).to.not.have.been.called;
        });
    });
}
