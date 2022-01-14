<template>
    <div>
        <h1>Tableau 1</h1>
        <Simple-table :dataTable="dataTable" />
        <br />
        <h1>Tableau 2</h1>
        <Simple-table :dataTable="dataTable2" />
        <br />
    </div>
</template>

<script>
import SimpleTable from "#app/components/Table/SimpleTable.vue";
import plans from "./plans.js";

export default {
    components: {
        SimpleTable
        // RbTable
    },
    data() {
        return {
            dataTable: {
                caption: "Dispositifs - National",
                columns: [
                    "Nom du dispositif",
                    "Dpt",
                    "Lieu",
                    "Pilote",
                    "Opérateur"
                ],
                datas: plans,
                emptyTableText: "Aucun élément à afficher"
            },
            dataTable2: {
                caption: "Dispositifs - National",
                columns: [
                    "Nom du dispositif",
                    "Dpt",
                    "Lieu",
                    "Pilote",
                    "Opérateur"
                ],
                datas: [],
                emptyTableText: "Aucun élément à afficher"
            }
        };
    }
};
</script>
