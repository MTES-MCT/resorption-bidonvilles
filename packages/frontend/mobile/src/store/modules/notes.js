import { get, set } from "idb-keyval";
import getRandomString from "#src/js/utils/getRandomString";

export default {
    namespaced: true,

    state: {
        notes: []
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
        REMOVE_NOTE(state, index) {
            state.notes.splice(index, 1);
        }
    },

    actions: {
        async load({ commit }) {
            commit("SET_NOTES", (await get("notes")) || []);
        },

        async createNote({ commit, state }) {
            const note = {
                id: getRandomString(30),
                title: "",
                description: "",
                shantytown: null,
                published: false,
                created_at: new Date()
            };

            commit("ADD_NOTE", note);
            await set("notes", state.notes);

            return note;
        },

        async updateNote({ commit, state }, note) {
            const index = state.notes.findIndex(({ id }) => id === note.id);
            if (index === undefined) {
                return;
            }

            commit("UPDATE_NOTE", { index, note });
            await set("notes", state.notes);
        },

        async deleteNote({ commit, state }, noteId) {
            const index = state.notes.findIndex(({ id }) => id === noteId);
            if (index === undefined) {
                return;
            }

            commit("REMOVE_NOTE", index);
            await set("notes", state.notes);
        }
    }
};
