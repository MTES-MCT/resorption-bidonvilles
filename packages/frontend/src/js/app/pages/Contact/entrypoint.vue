<template>
    <Guard>
        <PrivatePage />
    </Guard>
</template>

<script>
export default {
    metaInfo: {
        title: "Contact -"
    },
    components: {
        PrivatePage: () => import("./index.vue")
    }
};
</script>
