<template>
    <Guard>
        <PrivatePage />
    </Guard>
</template>

<script>
export default {
    metaInfo: {
        title: "Statistiques -"
    },
    components: {
        PrivatePage: () => import("./index.vue")
    }
};
</script>
