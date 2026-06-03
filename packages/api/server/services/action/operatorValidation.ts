import ServiceError from '#server/errors/ServiceError';

type OperatorInput = {
    id: number,
    organization_id: number,
    is_principal?: boolean,
};

const validateAndNormalizeOperators = (operators: OperatorInput[]): void => {
    if (operators.length === 0) {
        return;
    }

    if (operators.length === 1) {
        if (operators[0].is_principal !== true) {
            // eslint-disable-next-line no-param-reassign
            operators[0].is_principal = true;
        }
        return;
    }

    const principalCount = operators.filter(op => op.is_principal === true).length;

    if (principalCount === 0) {
        throw new ServiceError(
            'no_principal_operator',
            new Error('Vous devez désigner un opérateur principal parmi les opérateurs de l\'action'),
        );
    }

    if (principalCount > 1) {
        throw new ServiceError(
            'multiple_principal_operators',
            new Error('Un seul opérateur peut être désigné comme principal'),
        );
    }
};

export default validateAndNormalizeOperators;
