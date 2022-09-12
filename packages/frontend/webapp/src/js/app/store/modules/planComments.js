import { addComment } from "#helpers/api/plan";
import publishNewComment from "./_common/publishNewComment";

export default {
    namespaced: true,

    actions: {
        publishComment({ commit }, { planId, comment }) {
            let response;
            try {
                response = publishNewComment(
                    {
                        id: planId,
                        type: "Action",
                        apiMethod: addComment,
                        newComment: comment,
                        storeMethod: "updatePlanComments",
                        notificationText:
                            "Votre message est bien enregistré et a été envoyé aux acteurs concernés de votre département par mail.",
                        matomoAction: "Création commentaire action"
                    },
                    commit
                );
            } catch (e) {
                console.log(e);
            }
            return response;
        }
    }
};
