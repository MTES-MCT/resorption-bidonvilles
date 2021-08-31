<template>
    <div>
        <ClientOnly>
            <PrivatePage />
        </ClientOnly>
    </div>
</template>

<script>
export default {
    components: {
        PrivatePage: () => import("./covid.vue")
    }
};
</script>
