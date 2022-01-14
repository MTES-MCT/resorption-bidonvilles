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
// import RbTable from "#app/components/Table/RbTable.vue";

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
                datas: [
                    {
                        name:
                            "Programme d’accès au logement et à l’insertion pour des familles sorties des squats et des campements du département des Alpes-Maritimes",
                        departement: "06",
                        site:
                            "Sur site, dans le logement, au sein de locaux associatifs...",
                        manager: "Préfecture de département - Alpes-Maritimes",
                        operator: "Accompagnement promotion insertion Provence"
                    },
                    {
                        name:
                            "Accompagnement des familles intracommunautaires.",
                        departement: "94",
                        site: "3 Avenue Pierre Sémard",
                        manager:
                            "Direction Régionale et Interdépartementale de l'Hébergement et du Logement - Île-de-France",
                        operator: "Convivances"
                    }
                ],
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
