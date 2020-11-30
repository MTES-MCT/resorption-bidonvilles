<template>
    <Table :columns="columns" :rows="rows" />
</template>

<script>
    import { VueGoodTable as Table } from 'vue-good-table';

    export default {
        components: {
            Table
        },
        computed: {
            columns() {
                return [
                    {
                        field: 'name',
                        label: 'Nom du dispositif',
                    },
                    {
                        field: 'departement.name',
                        label: 'Dpt'
                    },
                    {
                        field: 'addressSimple',
                        label: 'Lieu'
                    },
                ];
            },
            rows() {
                return [
                    {
                        'id': 1,
                        'name': 'foo',
                        'departement': {
                            'code': '69',
                            'name': 'Rhône'
                        },
                        'addressSimple': 'Lyon - Foo',
                    },
                    {
                        'id': 2,
                        'name': 'bar',
                        'departement': {
                            'code': '69',
                            'name': 'Rhône'
                        },
                        'addressSimple': 'Lyon - Bar',
                    },
                ];
            },
        },
        methods: {
            clickRow: () => {
                console.log('click row');
            }
        }
    };
</script>
