import { postApi, patchApi } from "#src/js/api";

export function createNote(note) {
    return postApi("/notes", note);
}

export function incrementNumberOfCopies(noteId) {
    return patchApi(`/notes/${encodeURI(noteId)}/number_of_copies`);
}

export function registerPublication(note) {
    return postApi(`/notes/${encodeURI(note.note_id)}/publications`, note);
}
