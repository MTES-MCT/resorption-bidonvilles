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
        PrivatePage: () => import("./launcher.vue")
    }
};
</script>
