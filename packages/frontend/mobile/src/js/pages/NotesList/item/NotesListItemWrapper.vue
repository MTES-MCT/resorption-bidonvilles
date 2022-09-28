<template>
    <LeftSlidingBlock>
        <template slot="body">
            <Container @click.native="$router.push(`/notes/${note.id}`)">
                <NotesListItem :note="note" />
            </Container>
        </template>
        <template slot="slider">
            <div
                class="bg-red h-full flex justify-center items-center text-white text-xl"
                @click="$emit('delete', note.id)"
            >
                <Icon icon="trash-alt" />
            </div>
        </template>
    </LeftSlidingBlock>
</template>

<script>
import { Icon } from "@resorptionbidonvilles/ui";
import Container from "#src/js/components/Container.vue";
import LeftSlidingBlock from "#src/js/components/LeftSlidingBlock.vue";
import NotesListItem from "./NotesListItem.vue";

export default {
    components: {
        Icon,
        Container,
        LeftSlidingBlock,
        NotesListItem
    },

    props: {
        note: {
            type: Object,
            required: true
        }
    }
};
</script>
