/* eslint-disable no-restricted-syntax */
import shantytownPreparatoryPhasesTowardResorptionModel from '#server/models/shantytownPreparatoryPhasesTowardResorptionModel';
import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';
import { Differences, SimplifiedPhase } from '#root/types/resources/ShantytownPreparatoryPhasesTowardResorption.d';

function convertCompletedAt(timestamp: number | null): string | null {
    if (timestamp === null) { return null; }
    return new Date(timestamp * 1000).toISOString();
}

function createPhaseEntry(phaseId: string, completedAt: number | null): SimplifiedPhase {
    return {
        preparatoryPhaseId: phaseId,
        completedAt,
    };
}

function createModifiedPhaseEntry(phaseId: string, oldCompletedAt: number | null, newCompletedAt: number | null) {
    return {
        preparatoryPhaseId: phaseId,
        oldCompletedAt: convertCompletedAt(oldCompletedAt),
        newCompletedAt: convertCompletedAt(newCompletedAt),
    };
}

function findAddedPhases(existingMap: Map<string, number | null>, updatedMap: Map<string, number | null>) {
    return Array.from(updatedMap.entries())
        .filter(([phaseId]) => !existingMap.has(phaseId))
        .map(([phaseId, completedAt]) => createPhaseEntry(phaseId, completedAt));
}

function findRemovedPhases(existingMap: Map<string, number | null>, updatedMap: Map<string, number | null>) {
    return Array.from(existingMap.entries())
        .filter(([phaseId]) => !updatedMap.has(phaseId))
        .map(([phaseId, completedAt]) => createPhaseEntry(phaseId, completedAt));
}

function findModifiedPhases(existingMap: Map<string, number | null>, updatedMap: Map<string, number | null>) {
    return Array.from(updatedMap.entries())
        .filter(([phaseId]) => existingMap.has(phaseId))
        .filter(([phaseId, newCompletedAt]) => existingMap.get(phaseId) !== newCompletedAt)
        .map(([phaseId, newCompletedAt]) => createModifiedPhaseEntry(phaseId, existingMap.get(phaseId), newCompletedAt));
}

function comparePreparatoryPhases(existing: SimplifiedPhase[], updated: SimplifiedPhase[]): Differences {
    const existingMap = new Map(
        existing.map(phase => [phase.preparatoryPhaseId, phase.completedAt]),
    );

    const updatedMap = new Map(
        updated.map(phase => [phase.preparatoryPhaseId, phase.completedAt]),
    );

    return {
        addedPhases: findAddedPhases(existingMap, updatedMap),
        removedPhases: findRemovedPhases(existingMap, updatedMap),
        modifiedPhases: findModifiedPhases(existingMap, updatedMap),
    };
}

function createAddedPhasesPromises(
    addedPhases: SimplifiedPhase[],
    shantytownId: string,
    userId: number,
    transaction: Transaction,
) {
    return addedPhases.map(data => shantytownPreparatoryPhasesTowardResorptionModel.create(
        {
            fk_shantytown: Number.parseInt(shantytownId, 10),
            fk_preparatory_phase: data.preparatoryPhaseId,
            created_by: userId,
            completed_at: data.completedAt,
        },
        transaction,
    ));
}

function createRemovedPhasesPromises(
    removedPhases: SimplifiedPhase[],
    shantytownId: string,
    transaction: Transaction,
) {
    return removedPhases.map(data => shantytownPreparatoryPhasesTowardResorptionModel.delete(
        {
            fk_shantytown: Number.parseInt(shantytownId, 10),
            fk_preparatory_phase: data.preparatoryPhaseId,
        },
        transaction,
    ));
}

function createModifiedPhasesPromises(
    modifiedPhases: Differences['modifiedPhases'],
    shantytownId: string,
    transaction: Transaction,
) {
    return modifiedPhases.map(data => shantytownPreparatoryPhasesTowardResorptionModel.update(
        {
            shantytownId: Number.parseInt(shantytownId, 10),
            preparatoryPhaseId: data.preparatoryPhaseId,
            completedAt: data.newCompletedAt,
        },
        transaction,
    ));
}

function extractExistingPhases(result): SimplifiedPhase[] {
    if (!result) {
        return [];
    }
    return result[0].preparatoryPhases.map(phase => ({
        preparatoryPhaseId: phase.preparatoryPhaseId,
        completedAt: phase.completedAt,
    }));
}

function buildUpdatedPhases(preparatoryPhasesTowardResorption, terminatedPreparatoryPhasesTowardResorption): SimplifiedPhase[] {
    return preparatoryPhasesTowardResorption.map(phase => ({
        preparatoryPhaseId: phase,
        completedAt: terminatedPreparatoryPhasesTowardResorption[phase]
            ? new Date(terminatedPreparatoryPhasesTowardResorption[phase]).getTime() / 1000
            : null,
    }));
}

function createAllPromises(differences: Differences, shantytownId: string, userId: number, transaction: Transaction) {
    return [
        ...createAddedPhasesPromises(differences.addedPhases, shantytownId, userId, transaction),
        ...createRemovedPhasesPromises(differences.removedPhases, shantytownId, transaction),
        ...createModifiedPhasesPromises(differences.modifiedPhases, shantytownId, transaction),
    ];
}

export default async function update(shantytownId: string, preparatoryPhasesTowardResorption, terminatedPreparatoryPhasesTowardResorption, user, argTransaction: Transaction = undefined) {
    let transaction: Transaction = argTransaction;
    transaction ??= await sequelize.transaction();

    try {
        const result = await shantytownPreparatoryPhasesTowardResorptionModel.find(user, [shantytownId], transaction);

        const existingPhases = extractExistingPhases(result);
        const updatedPhases = buildUpdatedPhases(preparatoryPhasesTowardResorption, terminatedPreparatoryPhasesTowardResorption);
        const differences = comparePreparatoryPhases(existingPhases, updatedPhases);

        const promises = createAllPromises(differences, shantytownId, user.id, transaction);

        if (promises.length > 0) {
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
}
