import { addComment, addCovidComment } from "#helpers/api/town";
import Vue from "vue";

export default {
    namespaced: true,

    actions: {
        async publishComment({ commit }, { townId, comment }) {
            const { comments } = await addComment(townId, comment);

            commit(
                "updateShantytownComments",
                { townId, comments },
                { root: true }
            );
            Vue.prototype.$trackMatomoEvent(
                "Site",
                "Création commentaire",
                `S${townId}`
            );
        },

        async publishCovidComment({ commit }, { townId, comment }) {
            const { comments } = await addCovidComment(townId, comment);

            commit(
                "updateShantytownComments",
                { townId, comments },
                { root: true }
            );
            Vue.prototype.$trackMatomoEvent(
                "Site",
                "Création commentaire Covid",
                `S${townId}`
            );
        }
    }
};
