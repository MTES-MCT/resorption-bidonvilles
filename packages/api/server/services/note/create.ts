import noteModel from '#server/models/noteModel';
import ServiceError from '#server/errors/ServiceError';

export default async (note_id: string, created_from: string, number_of_copies: number, created_by: number, created_at: string): Promise<string> => {
    // on insère la note
    let noteId: string;
    try {
        noteId = await noteModel.create(
            note_id, created_from, number_of_copies, created_by, created_at
        );
    } catch (error) {
        throw new ServiceError('insert_failed', error);
    }

    // on retourne l'identifiant de la ligne insérée dans la table "notes"
    return noteId;
};