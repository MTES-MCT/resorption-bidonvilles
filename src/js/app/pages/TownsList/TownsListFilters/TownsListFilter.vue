<template>
    <Dropdown>
        <template v-slot:button>
            <Button variant="filter" size="sm">{{
                titleWithActiveFilters
            }}</Button>
        </template>
        <template v-slot:menu>
            <Menu>
                <div
                    v-for="option in options"
                    :key="option.id"
                    class="flex items-center whitespace-no-wrap text-sm"
                >
                    <Checkbox
                        :checkValue="option.value"
                        :value="value"
                        @input="$emit('input', $event)"
                        variant="invisible"
                        containerClasses="w-full"
                        labelClasses="w-full block"
                        v-slot="{ isChecked }"
                    >
                        <div
                            class="flex items-center justify-between w-full  hover:bg-blue100 py-1 px-2 text-primary"
                        >
                            <div class="flex-1">{{ option.label }}</div>
                            <div class="ml-4" v-if="isChecked">
                                <Icon icon="check" />
                            </div>
                        </div>
                    </Checkbox>
                </div>

                <Button
                    size="sm"
                    variant="primaryText"
                    class="mt-2 "
                    @click="$emit('input', [])"
                >
                    Effacer
                </Button>
            </Menu>
        </template>
    </Dropdown>
</template>

<script>
export default {
    props: {
        title: {
            type: String
        },
        options: {
            type: Array
        },
        value: {
            type: Array
        }
    },
    computed: {
        titleWithActiveFilters() {
            if (!this.value.length) {
                return this.title;
            }

            return `${this.title} (${this.value.length})`;
        }
    }
};
</script>
