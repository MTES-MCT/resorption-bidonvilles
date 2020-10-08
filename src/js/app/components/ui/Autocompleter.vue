<template>
    <InputWrapper>
        <InputLabel :label="label" :info="info" />
        <ValidationProvider ref="provider" :rules="rules" :name="validationName || label" v-slot="{ errors }" :vid="id">
            <AutocompleteVue

                    :search="search"
                    :default-value="defaultValue"
                    :placeholder="placeholder"
                    :aria-label="placeholder"
                    :getResultValue="getResultValue"
                    :debounceTime="debounceTime"
                    @submit="onItemSelect"
            >
                <template
                        #default="{
                rootProps,
                inputProps,
                inputListeners,
                resultListProps,
                resultListListeners,
                results,
                resultProps
              }"
                >
                    <div v-bind="rootProps">

                        <input
                                ref="searchInput"
                                v-bind="inputProps"
                                v-on="inputListeners"
                                :class="classes"
                                @focus="handleFocus"
                                @blur="handleBlur"
                                v-model="searchInput"
                        />
                        <div :class="['origin-top-left-10 absolute z-10 left-0 mt-2 w-full rounded-md shadow-lg transform transition ease-in-out duration-200', focused ? 'opacity-100' : 'opacity-0']">
                            <slot :results="results" :resultListProps="resultListProps" :resultListListeners="resultListListeners" :resultProps="resultProps" :getResultValue="getResultValue">
                                <Menu v-if="!results.length">
                                    <MenuItem >
                                        Aucun résultats
                                    </MenuItem>
                                </Menu>
                                <Menu v-else  v-bind="resultListProps" v-on="resultListListeners">
                                    <MenuItem v-for="(result, index) in results" :key="resultProps[index].id" v-bind="resultProps[index]" :class="['cursor-pointer', resultProps[index]['aria-selected'] && 'bg-gray-100']">
                                        <div>{{ getResultValue(result) }}</div>
                                    </MenuItem>
                                </Menu>

                            </slot>
                        </div>
                    </div>
                </template>
            </AutocompleteVue>
            <InputError>{{ errors[0] }}</InputError>
        </ValidationProvider>
    </InputWrapper>
</template>

<script>
    import InputLabel from './primitives/input/utils/InputLabel'
    import InputWrapper from './primitives/input/utils/InputWrapper'
    import InputInfo from './primitives/input/utils/InputInfo'
    import InputError from './primitives/input/utils/InputError'
    import getInputClasses from './primitives/input/utils/getInputClasses';

    export default {
        components: {
            InputLabel,
            InputWrapper,
            InputInfo,
            InputError
        },
        props: {
            label: {
                type: String
            },
            info: {
                type: String
            },
            validationName: {
                type: String,
            },
            rules: {
                type: String,
            },
            id: {
                type: String
            },
            search: {
              type: Function,
              required: true
            },
            defaultValue: {
                type: String,
                required: false,
                default: ''
            },
            placeholder: {
                type: String,
            },
            getResultValue: {
                type: Function,
                default: val => val
            },
            debounceTime: {
              type: Number,
              default: 0
            },
            variant: {
                type: String,
                default: 'default'
            },
        },
        computed: {
            classes() {
                return {
                    state: [...getInputClasses('state', this.error)],
                    default: getInputClasses('default')
                }[this.variant]
            },
        },
        data() {
            return {
                focused: false,
                value: '',
                searchInput: '',
                results: []
            }
        },
        methods: {
            onItemSelect(newValue) {
                // If user has selected an item, update search input
                if (newValue) {
                    this.searchInput = this.getResultValue(newValue)
                }
                // Update local new value & Emit
                this.value = newValue;
                this.$emit('submit', newValue)
                this.$refs.provider.syncValue(newValue);
                this.$refs.provider.validate();
                this.$refs.searchInput.blur()

            },
            handleFocus() {
                this.focused = true
            },

            handleBlur() {
                // If user has deleted his input, delete the selected value
                if (!this.searchInput) {
                    this.onItemSelect(null)
                }
                // If user has changed his last input, restore to last value
                else {
                    this.searchInput = this.getResultValue(this.value)
                }
                this.focused = false
            }
        }
    }
</script>
