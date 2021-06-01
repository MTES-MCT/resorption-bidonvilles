<template>
    <div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit, errors, failed }">
            <form class="w-full max-w-xl" @submit.prevent="handleSubmit(onSubmit)">
                <AutocompleteV2
                        id="test"
                        label="Pick a label"
                        :defaultValue="result ? resultValue(result) : ''"
                        :search="search"
                        v-model="result"
                        @submit="result = $event"
                        :getResultValue="resultValue"
                        placeholder="Pick a label"
                        rules="required"

                >
                    <template   #default="{
                                    resultListProps,
                                    resultListListeners,
                                    results,
                                    resultProps,
                                    getResultValue
                    }">
                        <Menu v-bind="resultListProps" v-on="resultListListeners">
                            <div v-for="(category, index) in getCategories(results)" class="flex flex-row border-b-2 border-gray-100">
                                <div class="px-4 py-2">{{category.label}}</div>
                                <div class="flex-1">
                                    <MenuItem v-for="(result, index) in results"
                                              :key="resultProps[index].id"
                                              v-bind="resultProps[index]"
                                              v-if="category.label === result.category"
                                              :class="['flex flex-col cursor-pointer', resultProps[index]['aria-selected'] && 'bg-gray-100']">
                                        {{result.label}}
                                    </MenuItem>
                                </div>
                            </div>
                        </Menu>
                    </template>

                </AutocompleteV2>
                <div v-if="result">result: {{result.category}} - {{result.label}}</div>
                <Button type="submit">Submit</Button>
            </form>
        </ValidationObserver>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                input: 'test',
                result: '',
            }
        },
        methods: {
            onSubmit() {
                alert(this.result)
            },
            resultValue(input) {
                return input.label
            },
            getCategories(items) {
                const groupBy = (items, key) => items.reduce(
                    (result, item) => ({
                        ...result,
                        [item[key]]: [
                            ...(result[item[key]] || []),
                            item,
                        ],
                    }),
                    {},
                );

                return Object.values(groupBy(items, 'category')).map(categoryItems => ({label: categoryItems[0].category, items: categoryItems}))
            },
            search(input) {
                this.input = input;

                return Promise.resolve([
                    {id: 1, label: 'labelA', category: 'categoryA', data: {
                            code: 'test', type: 'type'
                        }},
                    {id: 2, label: 'labelB', category: 'categoryA', data: {
                            code: 'test', type: 'type'
                        }},
                    {id: 3, label: 'labelC', category: 'categoryB', data: {
                            code: 'test', type: 'type'
                        }},
                    {id: 4, label: 'labelD', category: 'categoryB', data: {
                            code: 'test', type: 'type'
                        }},
                    {id: 5, label: 'labelE', category: 'categoryC', data: {
                            code: 'test', type: 'type'
                        }}
                ])
            },
        }
    }

</script>


