<template>
    <p class="text-center">
        <Button
            variant="textPrimary"
            :truncate="true"
            :disabled="disabled"
            :class="`border border-G500 rounded-lg w-full ${textColor}`"
            icon="search"
            iconPosition="left"
        >
            {{ wording }}
        </Button>
    </p>
</template>

<script>
import { Button } from "@resorptionbidonvilles/ui";

export default {
    components: {
        Button
    },

    props: {
        disabled: {
            type: Boolean,
            required: false,
            default: false
        },
        value: {
            type: String,
            required: false,
            default: null
        }
    },

    computed: {
        wording() {
            if (!this.value) {
                return "Saisissez le nom d'un site";
            }

            return this.value;
        },
        textColor() {
            if (!this.value) {
                return "text-G400";
            }

            return "text-primary";
        }
    }
};
</script>
