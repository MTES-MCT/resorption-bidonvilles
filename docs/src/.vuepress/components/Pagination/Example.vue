<template>
    <Pagination :onChangePage="(page) => currentPage = page" :currentPage="currentPage" :nbPages="nbPages" />
</template>

<script>
export default {
    data() {
        return {
            currentPage: 1,
            nbPages: 10
        }
    },

}
</script>
