import chai from 'chai';
import ServiceError from '#server/errors/ServiceError';
import { ActionOperatorInput } from '#server/services/action/ActionInput.d';
import validateAndNormalizeOperators from './operatorValidation';

const { expect } = chai;

describe('services/action/operatorValidation', () => {
    it('ne mute pas et ne throw pas avec une liste vide', () => {
        const operators: ActionOperatorInput[] = [];
        expect(() => validateAndNormalizeOperators(operators)).not.to.throw();
        expect(operators).to.deep.equal([]);
    });

    it('auto-marque is_principal=true sur l\'unique opérateur sans is_principal', () => {
        const operators: ActionOperatorInput[] = [{ id: 1, organization_id: 10 }];
        validateAndNormalizeOperators(operators);

        expect(operators[0].is_principal).to.equal(true);
    });

    it('reste idempotent si l\'unique opérateur est déjà is_principal=true', () => {
        const operators: ActionOperatorInput[] = [{ id: 1, organization_id: 10, is_principal: true }];
        validateAndNormalizeOperators(operators);

        expect(operators[0].is_principal).to.equal(true);
    });

    it('lève ServiceError no_principal_operator si aucun opérateur n\'est principal sur une liste de taille ≥ 2', () => {
        const operators: ActionOperatorInput[] = [
            { id: 1, organization_id: 10, is_principal: false },
            { id: 2, organization_id: 20, is_principal: false },
        ];

        let caughtError: ServiceError | null = null;
        try {
            validateAndNormalizeOperators(operators);
        } catch (err) {
            caughtError = err as ServiceError;
        }

        expect(caughtError).to.be.instanceOf(ServiceError);
        expect(caughtError?.code).to.equal('no_principal_operator');
        expect(caughtError?.nativeError).to.be.instanceOf(Error);
    });

    it('ne throw pas avec ≥ 2 opérateurs et exactement 1 is_principal=true', () => {
        const operators: ActionOperatorInput[] = [
            { id: 1, organization_id: 10, is_principal: true },
            { id: 2, organization_id: 20, is_principal: false },
        ];

        expect(() => validateAndNormalizeOperators(operators)).not.to.throw();
        expect(operators[0].is_principal).to.equal(true);
        expect(operators[1].is_principal).to.equal(false);
    });

    it('lève ServiceError multiple_principal_operators si plus d\'un opérateur est principal', () => {
        const operators: ActionOperatorInput[] = [
            { id: 1, organization_id: 10, is_principal: true },
            { id: 2, organization_id: 20, is_principal: true },
        ];

        let caughtError: ServiceError | null = null;
        try {
            validateAndNormalizeOperators(operators);
        } catch (err) {
            caughtError = err as ServiceError;
        }

        expect(caughtError).to.be.instanceOf(ServiceError);
        expect(caughtError?.code).to.equal('multiple_principal_operators');
        expect(caughtError?.nativeError).to.be.instanceOf(Error);
    });
});
