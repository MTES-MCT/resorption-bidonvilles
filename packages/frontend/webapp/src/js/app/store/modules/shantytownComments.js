import { addComment, addCovidComment } from "#helpers/api/town";
import { notify } from "#helpers/notificationHelper";
import Vue from "vue";

export default {
    namespaced: true,

    actions: {
        publishComment({ commit }, { townId, comment }) {
            return publish(
                addComment,
                townId,
                comment,
                "Création commentaire",
                commit
            );
        },

        publishCovidComment({ commit }, { townId, comment }) {
            return publish(
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
    commit("updateShantytownComments", { townId, comments }, { root: true });

    notify({
        group: "notifications",
        type: "success",
        title: "Message publié",
        text:
            "Votre message est bien enregistré et a été envoyé aux acteurs de votre département par mail."
    });

    Vue.prototype.$trackMatomoEvent("Site", matomoAction, `S${townId}`);
}
