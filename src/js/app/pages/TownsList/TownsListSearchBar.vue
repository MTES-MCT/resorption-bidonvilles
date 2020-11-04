<template>
    <div class="mx-auto max-w-screen-sm">
        <form @submit.prevent="onSubmit">
            <AutocompleteV2
                id="test"
                label="Rechercher un site, une commune, un département, un arrondissement"
                :defaultValue="result ? resultValue(result) : ''"
                :search="search"
                v-model="result"
                @submit="$emit('input', $event)"
                :getResultValue="resultValue"
                :loading="loading"
                prefixIcon="search"
                :inputClasses="['rounded-full']"
            />
            <div class="-mt-6 text-right">
                <Button variant="primaryText"
                    >Voir tous les sites de France</Button
                >
            </div>
        </form>
    </div>
</template>

<script>
import { autocompleteLocation as autocompleter } from "#helpers/addressHelper";
export default {
    data() {
        return {
            input: "test",
            result: "",
            loading: false
        };
    },
    methods: {
        onSubmit() {
            alert(this.result);
        },
        resultValue(input) {
            console.log(input);
            return input.label;
        },
        search(input) {
            this.input = input;

            return autocompleter(input);
        }
    }
};
</script>
