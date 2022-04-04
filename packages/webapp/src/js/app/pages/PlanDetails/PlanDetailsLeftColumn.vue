<template>
    <FormLeftColumn :sections="sections" defaultSection="characteristics" />
</template>

<script>
import FormLeftColumn from "#app/components/ui/Form/FormLeftColumn.vue";

export default {
    props: {
        plan: {
            type: Object,
            required: true
        }
    },

    components: {
        FormLeftColumn
    },

    data() {
        const sections = [
            { id: "characteristics", label: "Intervention" },
            { id: "location", label: "Lieu" },
            {
                id: "people",
                label: "Contacts"
            },
            { id: "financial", label: "Financements" }
        ];

        if (this.plan.states.length > 0) {
            sections.push(
                ...[
                    { id: "team", label: "Équipe" },
                    { id: "audience", label: "Public" },
                    {
                        id: "droits_communs",
                        label: "Droits communs et ressources"
                    }
                ]
            );

            const topics = this.plan.topics.map(({ uid }) => uid);
            if (topics.includes("health")) {
                sections.push({ id: "sante", label: "Santé" });
            }
            if (topics.includes("school")) {
                sections.push({
                    id: "education",
                    label: "Éducation et scolarisation"
                });
            }
            if (topics.includes("work")) {
                sections.push({ id: "emploi", label: "Formation et emploi" });
            }
            if (topics.includes("housing")) {
                sections.push({ id: "logement", label: "Logement" });
            }
            if (topics.includes("safety")) {
                sections.push({
                    id: "securisation",
                    label: "Stabilisation et sécurisation du site"
                });
            }
        }

        return {
            sections
        };
    }
};
</script>
