<template>
    <div class="mx-auto searchbox -mb-6">
        <AutocompleteV2
            id="test"
            :defaultValue="this.$props.value"
            :search="search"
            v-model="result"
            @submit="$emit('input', $event)"
            :getResultValue="resultValue"
            :loading="loading"
            prefixIcon="search"
            :inputClasses="['rounded-full shadow-sm']"
        >
            <template v-slot:extra="{ removeItem }">
                <div class="py-1 px-2 text-right">
                    <Button
                        variant="primaryText"
                        @click="removeItem"
                        size="sm"
                        class="font-bold"
                        >Voir tous les sites de France</Button
                    >
                </div>
            </template>
            <template
                v-slot:default="{
                    results,
                    resultListProps,
                    resultListListeners,
                    resultProps,
                    getResultValue
                }"
            >
                <Menu v-if="!results.length">
                    <MenuItem>
                        Aucun résultats
                    </MenuItem>
                </Menu>
                <Menu v-bind="resultListProps" v-on="resultListListeners">
                    <div
                        :key="category.label"
                        v-for="category in getCategories(results)"
                        class="flex flex-row border-b-2 border-G100"
                    >
                        <div
                            class="px-4 py-2 w-48 text-G600 border-r-2 border-G100 text-sm text-right pr-4"
                        >
                            {{ category.label }}
                        </div>
                        <div class="flex-1">
                            <MenuItem
                                v-for="(r, index) in results"
                                :key="resultProps[index].id"
                                v-bind="resultProps[index]"
                                :class="[
                                    'flex flex-col cursor-pointer hover:bg-G100',
                                    r.type === category.label
                                        ? 'block'
                                        : 'hidden',
                                    resultProps[index]['aria-selected'] &&
                                        'bg-G100'
                                ]"
                            >
                                {{ getResultValue(r) }}
                            </MenuItem>
                        </div>
                    </div>
                </Menu>
            </template>
        </AutocompleteV2>
    </div>
</template>

<script>
import { autocompleteLocation as autocompleter } from "#helpers/addressHelper";
export default {
    props: {
        value: {
            type: Object
        }
    },
    data() {
        return {
            input: "test",
            result: "",
            results: [],
            loading: false
        };
    },
    methods: {
        onSubmit() {
            alert(this.result);
        },
        resultValue(input) {
            return input.label;
        },
        getCategories(items) {
            const groupBy = (items, key) =>
                items.reduce(
                    (result, item) => ({
                        ...result,
                        [item[key]]: [...(result[item[key]] || []), item]
                    }),
                    {}
                );

            return Object.values(groupBy(items, "type")).map(categoryItems => ({
                label: categoryItems[0].type,
                items: categoryItems
            }));
        },
        async search(input) {
            this.input = input;

            if (input) {
                this.loading = true;
                this.results = await autocompleter(input);

                this.loading = false;
                return this.results;
            }

            return [];
        }
    }
};
</script>

<style scoped>
.searchbox {
    max-width: 500px;
}
</style>
