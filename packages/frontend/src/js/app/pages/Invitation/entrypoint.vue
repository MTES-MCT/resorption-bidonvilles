<template>
    <Guard>
        <PrivatePage />
    </Guard>
</template>

<script>
export default {
    metaInfo: {
        title: "Invitation -"
    },
    components: {
        PrivatePage: () => import("./index.vue")
    }
};
</script>
