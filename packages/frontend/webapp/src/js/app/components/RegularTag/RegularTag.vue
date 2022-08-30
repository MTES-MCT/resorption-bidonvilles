<template>
    <Tag variant="withoutBackground" :class="tagClass">
        {{ tag.label }}
    </Tag>
</template>

<script>
import specialTags from "./specialTags";

export default {
    props: {
        tag: {
            type: Object,
            required: true
        }
    },
    computed: {
        tagClass() {
            const specialTag = specialTags.find(
                ({ uid }) => uid === this.tag.uid
            );
            if (specialTag !== undefined) {
                return specialTag.class;
            }

            return "text-black bg-blue300";
        }
    }
};
</script>
