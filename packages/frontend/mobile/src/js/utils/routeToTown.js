import router from "#src/js/router";

export default function (id, origin = "acces_direct") {
    router.currentRoute.value.meta.origin = origin;
    router.push(`/site/${id}`);
}
