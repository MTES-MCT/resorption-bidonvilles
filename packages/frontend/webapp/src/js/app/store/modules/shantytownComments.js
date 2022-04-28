import { addComment, addCovidComment } from "#helpers/api/town";
import { notify } from "#helpers/notificationHelper";
import Vue from "vue";

export default {
    namespaced: true,

    actions: {
        async publishComment({ commit }, { townId, comment }) {
            const { comments } = await addComment(townId, comment);
            notify({
                group: "notifications",
                type: "success",
                title: "Message publié",
                text:
                    "Votre message est bien enregistré et a été envoyé aux acteurs de votre département par mail."
            });

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
            notify({
                group: "notifications",
                type: "success",
                title: "Message publié",
                text:
                    "Votre message est bien enregistré et a été envoyé aux acteurs de votre département par mail."
            });

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
