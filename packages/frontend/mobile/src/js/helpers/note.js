import { postApi, patchApi } from "#src/js/api";

/**
 * POST /note
 */
export function createNote(note) {
    return postApi("/notes", note);
}

/**
 * PATCH /note
 */
export function addCopyNote(noteId) {
    return patchApi(`/notes/${encodeURI(noteId)}/add-copy`);
}

/**
 * POST /note-publication
 */
export function publishNoteInBdd(note) {
    return postApi("/publish-note", note);
}
