<template>
    <ClientOnly>
        <PrivatePage />
    </ClientOnly>
</template>

<script>
console.log(this)

export default {
    components: {
        PrivatePage: () => import("./pages/TownsList/TownsList.vue")
    },
    mounted() {
        console.log(this)
    }
}
</script>
