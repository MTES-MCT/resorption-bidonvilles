<template>
    <header class="bg-G300 py-3 text-primary">
        <Container class="flex justify-between items-center space-x-4">
            <TextInput
                prefixIcon="search"
                class="flex-1 text-G700"
                placeholder="Saisissez le nom d'un site"
                :withoutMargin="true"
                ref="input"
                v-model="search"
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
import { searchTowns } from "#src/js/helpers/town.js";

export default {
    components: {
        Container,
        TextInput,
        Button,
    },
    beforeUnmount() {
        if (this.request !== null) {
            this.request.abort();
            this.request = null;
        }
        this.search = "";
        this.results = null;
        this.error = null;
    },
    computed: {
        request: {
            get() {
                return this.$store.state.search.request;
            },
            set(value) {
                this.$store.commit("search/SET_REQUEST", value);
            },
        },
        search: {
            get() {
                return this.$store.state.search.search;
            },
            set(value) {
                this.$store.commit("search/SET_SEARCH", value);
            },
        },
        results: {
            get() {
                return this.$store.state.search.results;
            },
            set(value) {
                this.$store.commit("search/SET_RESULTS", value);
            },
        },
        error: {
            get() {
                return this.$store.state.search.error;
            },
            set(value) {
                this.$store.commit("search/SET_ERROR", value);
            },
        },
    },
    watch: {
        search() {
            this.startSearch();
        },
    },
    mounted() {
        this.$refs.input.focus();
    },
    methods: {
        cancel() {
            this.$router.back();
        },
        async startSearch() {
            if (this.request !== null) {
                this.request.abort();
            }

            this.results = null;
            this.request = null;
            this.error = null;
            if (this.search.length >= 3) {
                this.request = searchTowns(this.search);

                try {
                    this.results = await this.request;
                    this.request = null;
                } catch (error) {
                    this.error =
                        (error && error.user_message) ||
                        "Une erreur inconnue est survenue";
                }
            }
        },
    },
};
</script>
