import { get, set } from "idb-keyval";
import getRandomString from "#src/js/utils/getRandomString";
import { createComment } from "#src/js/helpers/townComment";

function setNotes(value) {
    set("notes", JSON.parse(JSON.stringify(value)));
}

export default {
    namespaced: true,

    state: {
        notes: [],
        filter: "unpublished",
        filterBarIsOpen: false,
        publishFormIsOpen: false,
        linkedShantytown: null,
    },

    mutations: {
        SET_NOTES(state, notes) {
            state.notes = notes;
        },
        ADD_NOTE(state, note) {
            state.notes.push(note);
        },
        UPDATE_NOTE(state, { index, note }) {
            state.notes[index] = note;
        },
        UPDATE_DESCRIPTION(state, { index, description }) {
            state.notes[index].description = description;
        },
        UPDATE_SHANTYTOWN(state, { index, shantytownId }) {
            state.notes[index].shantytown = shantytownId;
        },
        REMOVE_NOTE(state, index) {
            state.notes.splice(index, 1);
        },
        SET_FILTER(state, filter) {
            state.filter = filter;
        },
        SET_FILTER_BAR_IS_OPEN(state, isOpen) {
            state.filterBarIsOpen = isOpen === true;
        },
        SET_PUBLISH_FORM_IS_OPEN(state, isOpen) {
            state.publishFormIsOpen = !!isOpen;
        },
        SET_LINKED_SHANTYTOWN(state, shantytown) {
            state.linkedShantytown = shantytown;
        },
        ADD_NOTE_PUBLICATION(state, { index, publication }) {
            state.notes[index].publications.push(publication);
        },
    },

    actions: {
        async load({ commit }) {
            commit("SET_NOTES", (await get("notes")) || []);
        },

        async create({ commit, state }, shantytown = null) {
            const note = {
                id: getRandomString(30),
                description: "",
                shantytown,
                publications: [],
                created_at: new Date().toString(),
            };

            commit("ADD_NOTE", note);
            await setNotes(state.notes);

            return note;
        },
        setupFilterBarAfterCreation({ commit, state }) {
            if (state.filter === "unpublished") {
                return;
            }

            commit("SET_FILTER", "unpublished");
            commit("SET_FILTER_BAR_IS_OPEN", true);
        },

        async setDescription({ commit, state }, { id: noteId, description }) {
            const index = state.notes.findIndex(({ id }) => id === noteId);
            if (index === -1) {
                return;
            }

            commit("UPDATE_DESCRIPTION", { index, description });
            await setNotes(state.notes);
        },

        async setShantytown({ commit, state }, { id: noteId, shantytownId }) {
            const index = state.notes.findIndex(({ id }) => id === noteId);
            if (index === -1) {
                return;
            }

            commit("UPDATE_SHANTYTOWN", { index, shantytownId });
            await setNotes(state.notes);
        },

        async updateNote({ commit, state }, note) {
            const index = state.notes.findIndex(({ id }) => id === note.id);
            if (index === -1) {
                return;
            }

            commit("UPDATE_NOTE", { index, note });
            await setNotes(state.notes);
        },

        async deleteNote({ commit, state }, noteId) {
            const index = state.notes.findIndex(({ id }) => id === noteId);
            if (index === -1) {
                return;
            }

            commit("REMOVE_NOTE", index);
            await setNotes(state.notes);
        },

        async publishNote(
            { commit, state },
            { id: noteId, shantytown: shantytownId }
        ) {
            const index = state.notes.findIndex(({ id }) => id === noteId);
            if (index === -1) {
                throw new Error("La note à publier n'a pas été retrouvée");
            }

            try {
                const { comments } = await createComment(shantytownId, {
                    description: state.notes[index].description,
                });

                commit(
                    "SET_COMMENTS",
                    {
                        shantytown: shantytownId,
                        comments,
                    },
                    { root: true }
                );
                commit("ADD_NOTE_PUBLICATION", {
                    index,
                    publication: {
                        shantytown: shantytownId,
                        published_at: new Date().toString(),
                    },
                });
                await setNotes(state.notes);
            } catch (error) {
                throw new Error(
                    (error && error.user_message) ||
                        "Une erreur inconnue est survenue"
                );
            }
        },
    },

    getters: {
        filteredNotes(state) {
            if (state.filter === "all") {
                return sortBy([...state.notes], "creation");
            }

            return sortBy(
                state.notes.filter((note) => {
                    if (state.filter === "unpublished") {
                        return note.publications.length === 0;
                    }

                    return note.publications.length > 0;
                }),
                state.filter === "published" ? "publication" : "creation"
            );
        },
    },
};

function sortBy(notes, sortType) {
    notes.sort((a, b) => {
        if (sortType === "creation") {
            return a.created_at > b.created_at ? -1 : 1;
        }

        // sortType === 'publication'
        return a.publications[0].published_at > b.publications[0].published_at
            ? -1
            : 1;
    });

    return notes;
}
