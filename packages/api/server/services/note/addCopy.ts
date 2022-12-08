import ServiceError from '#server/errors/ServiceError';
import noteModel from '#server/models/noteModel';

export default async (noteId: string) => {
    let note;
    try {
        note = await noteModel.findOneById(noteId);
    } catch (error) {
        throw new ServiceError('note_read_error', error);
    }

    if (note === null) {
        throw new ServiceError('note_not_found', new Error('La note n\'existe pas'));
    }

    // update database
    try {
        await noteModel.addCopy(noteId);
    } catch (error) {
        throw new ServiceError('update_error', error);
    }
};
