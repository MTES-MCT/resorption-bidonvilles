<template>
    <Guard>
        <PrivatePage />
    </Guard>
</template>

<script>
export default {
    metaInfo: {
        title: "Nouveau mot de passe -"
    },
    components: {
        PrivatePage: () => import("./index.vue")
    }
};
</script>
