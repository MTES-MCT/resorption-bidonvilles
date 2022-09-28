import { get, set } from "idb-keyval";
import getRandomString from "#src/js/utils/getRandomString";
import { createComment } from "#src/js/helpers/townComment";

export default {
    namespaced: true,

    state: {
        notes: [],
        filter: "unpublished",
        publishFormIsOpen: false,
        linkedShantytown: null
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
        SET_PUBLISH_FORM_IS_OPEN(state, isOpen) {
            state.publishFormIsOpen = !!isOpen;
        },
        SET_LINKED_SHANTYTOWN(state, shantytown) {
            state.linkedShantytown = shantytown;
        },
        SET_NOTE_PUBLISHED(state, index) {
            state.notes[index].published = true;
        }
    },

    actions: {
        async load({ commit }) {
            commit("SET_NOTES", (await get("notes")) || []);
        },

        async createNote({ commit, state }) {
            const note = {
                id: getRandomString(30),
                description: "",
                shantytown: null,
                published: false,
                created_at: new Date()
            };

            commit("ADD_NOTE", note);
            await set("notes", state.notes);

            return note;
        },

        async setDescription({ commit, state }, { id: noteId, description }) {
            const index = state.notes.findIndex(({ id }) => id === noteId);
            if (index === -1) {
                return;
            }

            commit("UPDATE_DESCRIPTION", { index, description });
            await set("notes", state.notes);
        },

        async setShantytown({ commit, state }, { id: noteId, shantytownId }) {
            const index = state.notes.findIndex(({ id }) => id === noteId);
            if (index === -1) {
                return;
            }

            commit("UPDATE_SHANTYTOWN", { index, shantytownId });
            await set("notes", state.notes);
        },

        async updateNote({ commit, state }, note) {
            const index = state.notes.findIndex(({ id }) => id === note.id);
            if (index === -1) {
                return;
            }

            commit("UPDATE_NOTE", { index, note });
            await set("notes", state.notes);
        },

        async deleteNote({ commit, state }, noteId) {
            const index = state.notes.findIndex(({ id }) => id === noteId);
            if (index === -1) {
                return;
            }

            commit("REMOVE_NOTE", index);
            await set("notes", state.notes);
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
                await createComment(shantytownId, {
                    description: state.notes[index].description
                });

                commit("SET_NOTE_PUBLISHED", index);
                await set("notes", state.notes);
            } catch (error) {
                throw new Error(
                    (error && error.user_message) ||
                        "Une erreur inconnue est survenue"
                );
            }
        }
    },

    getters: {
        filteredNotes(state) {
            if (state.filter === "all") {
                return state.notes;
            }

            return state.notes.filter(
                note =>
                    note.published === true || state.filter === "unpublished"
            );
        }
    }
};
