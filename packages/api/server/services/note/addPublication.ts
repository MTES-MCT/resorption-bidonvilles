import noteModel from '#server/models/noteModel';
import ServiceError from '#server/errors/ServiceError';

export default async (note_id: string, shantytown_id: number, created_at: string): Promise<void> => {
    try {
        await noteModel.addPublication(
            note_id,
            shantytown_id,
            created_at,
        );
    } catch (error) {
        throw new ServiceError('insert_failed', error);
    }
};
