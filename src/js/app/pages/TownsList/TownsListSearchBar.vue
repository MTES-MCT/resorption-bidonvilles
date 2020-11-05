<template>
    <div class="mx-auto searchbox">
        <form @submit.prevent="onSubmit">
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
            />
            <div class="-mt-6 px-2 text-right">
                <Button variant="primaryText" class="text-display-sm"
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

<style>
.searchbox {
    max-width: 500px;
}
.searchShadow {
    box-shadow: 0px 0px 6px #00000033;
}
</style>
