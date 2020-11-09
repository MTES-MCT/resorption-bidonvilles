<template>
    <div class="mx-auto searchbox">
        <AutocompleteV2
            id="test"
            :defaultValue="result ? resultValue(result) : ''"
            :search="search"
            v-model="result"
            @submit="$emit('input', $event)"
            :getResultValue="resultValue"
            :loading="loading"
            prefixIcon="search"
            :inputClasses="['rounded-full shadow-sm']"
        >
            <template v-slot:extra="{ removeItem }">
                <div class=" px-2 text-right">
                    <Button
                        variant="primaryText"
                        class="text-display-sm"
                        @click="removeItem"
                        >Voir tous les sites de France</Button
                    >
                </div>
            </template>
        </AutocompleteV2>
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

<style>
.searchbox {
    max-width: 500px;
}
.searchShadow {
    box-shadow: 0px 0px 6px #00000033;
}
</style>
