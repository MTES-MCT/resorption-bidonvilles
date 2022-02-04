<template>
    <FormLeftColumn :sections="sections" defaultSection="characteristics" />
</template>

<script>
import FormLeftColumn from "#app/components/ui/Form/FormLeftColumn.vue";

export default {
    components: {
        FormLeftColumn
    },

    data() {
        return {
            sections: [
                { id: "characteristics", label: "Intervention" },
                { id: "location", label: "Lieu" },
                {
                    id: "people",
                    label: "Contacts"
                },
                { id: "financial", label: "Financements" },
                { id: "team", label: "Équipe" }
            ]
        };
    }
};
</script>
