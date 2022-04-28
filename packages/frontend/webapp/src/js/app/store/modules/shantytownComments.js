import { addComment, addCovidComment } from "#helpers/api/town";
import { notify } from "#helpers/notificationHelper";
import Vue from "vue";

export default {
    namespaced: true,

    actions: {
        async publishComment({ commit }, { townId, comment }) {
            publish(
                addComment,
                townId,
                comment,
                "Création commentaire",
                commit
            );
        },

        async publishCovidComment({ commit }, { townId, comment }) {
            publish(
                addCovidComment,
                townId,
                comment,
                "Création commentaire Covid",
                commit
            );
        }
    }
};

async function publish(apiMethod, townId, comment, matomoAction, commit) {
    const { comments } = await apiMethod(townId, comment);
    notify({
        group: "notifications",
        type: "success",
        title: "Message publié",
        text:
            "Votre message est bien enregistré et a été envoyé aux acteurs de votre département par mail."
    });

    commit("updateShantytownComments", { townId, comments }, { root: true });
    Vue.prototype.$trackMatomoEvent("Site", matomoAction, `S${townId}`);
}
