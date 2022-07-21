<template>
    <Tag variant="withoutBackground" :class="tagClass">
        {{ tag.label }}
    </Tag>
</template>

<script>
import specialTagsColl from "./specialTags";
export default {
    props: {
        tag: {
            type: Object,
            required: true
        }
    },
    computed: {
        tagClass: function() {
            const { specialTags } = specialTagsColl;
            // Class par défaut pour un regularTag ordinaire ("regular")
            let tagClass = "text-black bg-blue300";
            // On recherche si le tag fait partie des tags particuliers
            const resultat = specialTags.find(
                specialTag => specialTag.uid === this.tag.uid
            );
            // S'il s'agit d'un tag particulier, on applique la mise en forme qui correspond
            if (typeof resultat !== "undefined") {
                tagClass = resultat.class;
            }
            return tagClass;
        }
    }
};
</script>
