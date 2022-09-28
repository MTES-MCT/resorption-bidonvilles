<template>
    <p>
        <img
            src="/img/illustrations/notes_empty.svg"
            class="w-1/2 mx-auto max-w-lg"
        />
        <Button @click.native="$emit('create')">{{ wording }}</Button>
    </p>
</template>

<script>
import { Button } from "@resorptionbidonvilles/ui";

export default {
    components: {
        Button
    },

    computed: {
        wording() {
            if (this.$store.state.notes.notes.length === 0) {
                return "Cliquez ici pour rédiger votre première note";
            }

            return "Cliquez ici pour rédiger une nouvelle note";
        }
    }
};
</script>
