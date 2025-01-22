/* eslint-disable no-restricted-syntax */
import shantytownPreparatoryPhasesTowardResorptionModel from '#server/models/shantytownPreparatoryPhasesTowardResorptionModel';
import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';
import { Differences, SimplifiedPhase } from '#root/types/resources/ShantytownPreparatoryPhasesTowardResorption.d';

function convertCompletedAt(timestamp: number | null): string | null {
    if (timestamp === null) { return null; }
    return new Date(timestamp * 1000).toISOString();
}

function comparePreparatoryPhases(existing: SimplifiedPhase[], updated: SimplifiedPhase[]): Differences {
    // Convertir les tableaux en Map pour une comparaison plus facile
    const existingMap = new Map(
        existing.map(phase => [phase.preparatoryPhaseId, phase.completedAt]),
    );

    const updatedMap = new Map(
        updated.map(phase => [phase.preparatoryPhaseId, phase.completedAt]),
    );

    const differences = {
        addedPhases: [],
        removedPhases: [],
        modifiedPhases: [],
    };

    // Vérifier les phases ajoutées
    for (const [phaseId, completedAt] of updatedMap) {
        if (!existingMap.has(phaseId)) {
            differences.addedPhases.push({
                preparatoryPhaseId: phaseId,
                completedAt: completedAt === null ? null : convertCompletedAt(completedAt),
            });
        }
    }

    // Vérifier les phases supprimées
    for (const [phaseId, completedAt] of existingMap) {
        if (!updatedMap.has(phaseId)) {
            differences.removedPhases.push({
                preparatoryPhaseId: phaseId,
                completedAt: completedAt === null ? null : convertCompletedAt(completedAt),
            });
        }
    }


    // Vérifier les phases modifiées
    for (const [phaseId, completedAt] of updatedMap) {
        if (existingMap.has(phaseId)) {
            const existingCompletedAt = existingMap.get(phaseId);
            if (existingCompletedAt !== completedAt) {
                differences.modifiedPhases.push({
                    preparatoryPhaseId: phaseId,
                    oldCompletedAt: existingCompletedAt === null ? null : convertCompletedAt(existingCompletedAt),
                    newCompletedAt: completedAt === null ? null : convertCompletedAt(completedAt),
                });
            }
        }
    }

    return differences;
}

export default async (shantytownId: string, preparatoryPhasesTowardResorption, terminatedPreparatoryPhasesTowardResorption, user, argTransaction: Transaction = undefined) => {
    let transaction: Transaction = argTransaction;
    if (transaction === undefined) {
        transaction = await sequelize.transaction();
    }

    try {
        const result = await shantytownPreparatoryPhasesTowardResorptionModel.find(user, [shantytownId], transaction);

        let existingPreparatoryPhasesTowardResorption = [];
        if (result) {
            existingPreparatoryPhasesTowardResorption = result[0].preparatoryPhases.map(phase => ({
                preparatoryPhaseId: phase.preparatoryPhaseId,
                completedAt: phase.completedAt,
            }));
        }

        const updatedPreparatoryPhasesTowardResorption = preparatoryPhasesTowardResorption.map(phase => ({
            preparatoryPhaseId: phase,
            completedAt: terminatedPreparatoryPhasesTowardResorption[phase]
                ? new Date(terminatedPreparatoryPhasesTowardResorption[phase]).getTime() / 1000
                : null,
        }));

        const differences = comparePreparatoryPhases(
            existingPreparatoryPhasesTowardResorption,
            updatedPreparatoryPhasesTowardResorption,
        );

        const promises = [];
        if (differences.addedPhases.length > 0) {
            differences.addedPhases.map(async (data) => {
                promises.push(shantytownPreparatoryPhasesTowardResorptionModel.create(
                    {
                        fk_shantytown: parseInt(shantytownId, 10),
                        fk_preparatory_phase: data.preparatoryPhaseId,
                        created_by: user.id,
                        completed_at: data.completedAt,
                    },
                    transaction,
                ));
            });
        }

        if (differences.removedPhases.length > 0) {
            differences.removedPhases.map(async (data) => {
                promises.push(shantytownPreparatoryPhasesTowardResorptionModel.delete(
                    {
                        fk_shantytown: parseInt(shantytownId, 10),
                        fk_preparatory_phase: data.preparatoryPhaseId,
                    },
                    transaction,
                ));
            });
        }

        if (differences.modifiedPhases.length > 0) {
            differences.modifiedPhases.map(async (data) => {
                promises.push(shantytownPreparatoryPhasesTowardResorptionModel.update(
                    {
                        shantytownId: parseInt(shantytownId, 10),
                        preparatoryPhaseId: data.preparatoryPhaseId,
                        completedAt: data.newCompletedAt,
                    },
                    transaction,
                ));
            });
        }

        if (promises.length !== 0) {
            await Promise.all(promises);
        }

        if (argTransaction === undefined) {
            await transaction.commit();
        }
    } catch (error) {
        if (argTransaction === undefined) {
            await transaction.rollback();
        }
        throw error;
    }
};
