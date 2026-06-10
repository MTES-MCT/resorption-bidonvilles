type ActionWithOperators = {
    name: string;
    project_name?: string;
    operator_name?: string;
    operators: Array<{
        is_principal?: boolean;
        name: string;
        abbreviation: string | null;
    }>;
};

export default function computeActionNames(hash: { [key: number]: ActionWithOperators }): void {
    Object.values(hash).forEach((action) => {
        // Récupérer l'opérateur principal ; à défaut, le premier opérateur
        // (operators est toujours initialisé en tableau par hashActions)
        const principalOperator = action.operators.find(op => op.is_principal) ?? action.operators[0] ?? null;

        // Nom de la structure opérateur principal (prioriser l'abréviation)
        const operatorName = principalOperator
            ? (principalOperator.abbreviation || principalOperator.name || '')
            : '';

        // Nom du projet (stocké dans project_name)
        const projectName = action.project_name || '';

        // Calculer le nom complet : Structure opérateur principal - Nom du projet
        action.name = operatorName ? `${operatorName.charAt(0).toUpperCase() + operatorName.slice(1)} - ${projectName}` : projectName;
        /* eslint no-param-reassign: "error" */
        action.operator_name = operatorName;
    });
}
