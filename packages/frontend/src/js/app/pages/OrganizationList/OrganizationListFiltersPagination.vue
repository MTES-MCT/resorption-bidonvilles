<template>
    <div>
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <CustomFilter
                    title="Type de structure"
                    class="mr-2 mb-2"
                    :value="filters.organizationType"
                    @input="evt => $emit('update:organizationType', evt)"
                    :options="[
                        {
                            value: 'public_establishment',
                            label: `Service de l'état, établissement ou organisme public`
                        },
                        {
                            value: 'administration',
                            label: `Administration`
                        },
                        {
                            value: 'territorial_collectivity',
                            label: 'Collectivité territoriale'
                        },
                        { value: 'association', label: 'Association' }
                    ]"
                />
            </div>
            <Pagination
                v-if="nbPages > 1"
                :currentPage="currentPage"
                :nbPages="nbPages"
                :onChangePage="onChangePage"
            />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        filters: {
            type: Object
        },
        nbPages: {
            type: Number
        },
        currentPage: {
            type: Number
        },
        onChangePage: {
            type: Function
        }
    }
};
</script>
