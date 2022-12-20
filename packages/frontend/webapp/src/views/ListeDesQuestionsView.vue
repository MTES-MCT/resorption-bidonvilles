<template>
    <Layout>
        <ListeQuestions :questionsList="questionsList" />
    </Layout>
</template>

<script setup>
import Layout from "@/components/Layout/Layout.vue";
import ListeQuestions from "@/components/ListeDesQuestions/ListeQuestion.vue";

const questionsList = [
    {
        id: 1,
        question: "Lorem Ipsum 1",
        details: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Maecenas sed risus sed nibh sollicitudin lobortis.
            Praesent finibus dolor dolor, at ornare nisl convallis non.
            Curabitur nec gravida dolor. Pellentesque sit amet rhoncus nunc.
            Sed ut interdum neque, id tempor ipsum. Nunc enim massa, pretium
            ac luctus in, facilisis sed magna. In hac habitasse platea dictumst.
            Vivamus semper vulputate neque eu vehicula. Duis ac libero id libero
            euismod lacinia. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            
            Sed ac odio vitae erat porta mattis. Sed vel urna vel odio semper tincidunt
            quis non leo. Sed lobortis risus sit amet turpis finibus facilisis.
            Maecenas tincidunt felis lectus, non suscipit magna lobortis et. Donec a dolor
            consectetur, sagittis sapien in, ornare ipsum. Integer imperdiet ex eget diam
            scelerisque, vel aliquet mi rhoncus. Etiam dui tortor, pharetra sed ex nec,
            ornare mattis justo. Integer tincidunt tortor diam, in hendrerit nulla posuere
            et. Aenean semper et tortor vitae molestie. Nam rhoncus metus ac rhoncus tempor.
            Suspendisse potenti. Proin pellentesque tortor id sem vulputate tempor. Etiam
            diam nisi, mollis eu ultricies et, egestas quis purus.`,
        peopleAffected: 15,
        createdBy: {
            id: 513,
            first_name: "Christophe",
            last_name: "BENARD",
            role: "national_admin",
            organization: {
                id: 34195,
                name: "Commune - Bouguenais",
                abbreviation: null,
                active: true,
                type: {
                    id: 4,
                    uid: "commune",
                    name_singular: "Commune",
                    name_plural: "Communes",
                    abbreviation: null,
                },
                category: {
                    uid: "territorial_collectivity",
                    name_singular: "Collectivité territoriale",
                    name_plural: "Collectivités territoriales",
                },
                location: {
                    type: "city",
                    latitude: 47.3774,
                    longitude: -1.6754,
                    region: {
                        code: "52",
                        name: "Pays de la Loire",
                    },
                    departement: {
                        code: "44",
                        name: "Loire-Atlantique",
                    },
                    epci: {
                        code: "244400404",
                        name: "Nantes Métropole",
                    },
                    city: {
                        code: "44020",
                        name: "Bouguenais",
                        main: null,
                    },
                },
            },
        },
        createdAt: "2019-09-04 12:51:24.744 +0200",
        updatedAt: null,
        solvedAt: null,
    },
    {
        id: 2,
        question: "Lorem Ipsum 2",
        details: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Maecenas sed risus sed nibh sollicitudin lobortis.
            Praesent finibus dolor dolor, at ornare nisl convallis non.
            Curabitur nec gravida dolor. Pellentesque sit amet rhoncus nunc.
            Sed ut interdum neque, id tempor ipsum. Nunc enim massa, pretium
            ac luctus in, facilisis sed magna. In hac habitasse platea dictumst.
            Vivamus semper vulputate neque eu vehicula. Duis ac libero id libero
            euismod lacinia. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            
            Aenean semper et tortor vitae molestie. Nam rhoncus metus ac rhoncus tempor.
            Suspendisse potenti. Proin pellentesque tortor id sem vulputate tempor. Etiam
            diam nisi, mollis eu ultricies et, egestas quis purus.`,
        peopleAffected: 15,
        createdBy: {
            id: 1,
            first_name: "Anis",
            last_name: "SAFINE",
            role: "national_admin",
            organization: {
                id: 40760,
                name: "Délégation Interministérielle à l'Hébergement et à l'Accès au Logement",
                abbreviation: "DIHAL",
                active: true,
                type: {
                    id: 10,
                    uid: "delegation_interministere",
                    name_singular: "Délégation interministérielle",
                    name_plural: "Délégations interministérielles",
                    abbreviation: null,
                },
                category: {
                    uid: "administration",
                    name_singular: "Administration centrale",
                    name_plural: "Administrations centrales",
                },
                location: {
                    type: "nation",
                    latitude: 46.7755829,
                    longitude: 2.0497727,
                    region: null,
                    departement: null,
                    epci: null,
                    city: null,
                },
            },
        },
        createdAt: "2021-12-04 16:32:42.744 +0200",
        updatedAt: null,
        solvedAt: null,
    },
];
</script>
