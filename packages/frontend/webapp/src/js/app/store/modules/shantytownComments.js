import { addComment, addCovidComment } from "#helpers/api/town";
import publishNewComment from "./_common/publishNewComment";

export default {
    namespaced: true,

    actions: {
        publishComment({ commit }, { townId, comment }) {
            return publishNewComment(
                {
                    id: townId,
                    type: "Site",
                    apiMethod: addComment,
                    newComment: comment,
                    storeMethod: "updateShantytownComments",
                    notificationText:
                        "Votre message est bien enregistré et a été envoyé aux acteurs concernés de votre département par mail.",
                    matomoAction: "Création commentaire"
                },
                commit
            );
        },

        publishCovidComment({ commit }, { townId, comment }) {
            return publishNewComment(
                {
                    id: townId,
                    type: "Site",
                    apiMethod: addCovidComment,
                    newComment: comment,
                    storeMethod: "updateShantytownComments",
                    notificationText:
                        "Votre message est bien enregistré et a été envoyé aux acteurs concernés de votre département par mail.",
                    matomoAction: "Création commentaire Covid"
                },
                commit
            );
        }
    }
};
