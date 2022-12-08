import noteModel from '#server/models/noteModel';
import ServiceError from '#server/errors/ServiceError';

export default async (note_id: string, created_from: string, number_of_copies: number, created_by: number, created_at: string): Promise<void> => {
    try {
        await noteModel.create(
            note_id, created_from, number_of_copies, created_by, created_at,
        );
    } catch (error) {
        throw new ServiceError('insert_failed', error);
    }
};
