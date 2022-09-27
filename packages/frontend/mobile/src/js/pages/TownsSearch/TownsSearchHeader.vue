<template>
    <header class="bg-G300 py-3 text-primary">
        <Container class="flex justify-between items-center space-x-4">
            <TextInput
                prefixIcon="search"
                class="flex-1 text-G700"
                placeholder="Saisissez le nom ou l'adresse d'un site"
                :withoutMargin="true"
                ref="input"
            />
            <Button variant="textPrimary" :padding="false" @click="cancel"
                >Annuler</Button
            >
        </Container>
    </header>
</template>

<script>
import Container from "#src/js/components/Container.vue";
import { TextInput, Button } from "@resorptionbidonvilles/ui";

export default {
    components: {
        Container,
        TextInput,
        Button
    },
    mounted() {
        this.$refs.input.focus();
    },
    methods: {
        cancel() {
            this.$router.back();
        }
    }
};
</script>
