import { notify } from "#helpers/notificationHelper";
import Vue from "vue";

export default async function publishNewComment(data, commit) {
    const response = await data.apiMethod(data.id, data.newComment);
    commit(data.storeMethod, { id: data.id, response }, { root: true });

    notify({
        group: "notifications",
        type: "success",
        title: "Message publié",
        text: data.notificationText
    });

    Vue.prototype.$trackMatomoEvent(
        data.type,
        data.matomoAction,
        `S${data.id}`
    );
}
