import router from "@/helpers/router";
import escapeRegExp from "./escapeRegExp";

export default function (route) {
    const reg = new RegExp(`${escapeRegExp(route)}(?:[/#?]|$)`, "gi");
    if (reg.test(router.options.history.state.back)) {
        return router.back();
    }

    return router.replace(route);
}
