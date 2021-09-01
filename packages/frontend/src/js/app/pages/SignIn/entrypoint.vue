<template>
    <Guard>
        <PrivatePage />
    </Guard>
</template>

<script>
export default {
    metaInfo: {
        title: "Connexion -"
    },
    components: {
        PrivatePage: () => import("./index.vue")
    }
};
</script>
