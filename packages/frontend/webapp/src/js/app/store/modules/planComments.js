import { addComment } from "#helpers/api/plan";
import { notify } from "#helpers/notificationHelper";
import Vue from "vue";

export default {
    namespaced: true,

    actions: {
        publishComment({ commit }, { planId, comment }) {
            return publish(
                addComment,
                planId,
                comment,
                "Création commentaire action",
                commit
            );
        }
    }
};

async function publish(apiMethod, planId, newComment, matomoAction, commit) {
    const { comment } = await apiMethod(planId, newComment);
    commit("updatePlanComments", { planId, comment }, { root: true });

    notify({
        group: "notifications",
        type: "success",
        title: "Message publié",
        text:
            "Votre message est bien enregistré et a été envoyé aux acteurs concernés de votre département par mail."
    });

    Vue.prototype.$trackMatomoEvent("Site", matomoAction, `S${planId}`);
}
