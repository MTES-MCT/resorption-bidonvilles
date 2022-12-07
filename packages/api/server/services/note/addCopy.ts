import ServiceError from '#server/errors/ServiceError';
import noteModel from '#server/models/noteModel';

export default async (noteId: string) => {
    let note;
    try {
        note = await noteModel.findOneById(noteId);
    } catch (error) {
        throw new ServiceError('note_read_error', error);
    }

    // update database
    try {
        await noteModel.addCopy(noteId);
    } catch (error) {
        throw new ServiceError('update_error', error);
    }


    let updatedNote = null;
    try {
        updatedNote = await noteModel.findOneById(noteId);
    } catch (error) {
        // ignore
    }

    return updatedNote;
};