<template>
    <Dropdown>
        <template v-slot:button="{ isOpen }">
            <Button
                variant="custom"
                size="sm"
                :class="[
                    'px-4 rounded focus:outline-none border border-primary  ',
                    isOpen
                        ? 'bg-primary text-white hover:text-white focus:text-white'
                        : 'hover:bg-blue200 hover:text-primary text-primary'
                ]"
                >{{ titleWithActiveFilters }}</Button
            >
        </template>
        <template v-slot:menu>
            <Menu containerClasses="py-0">
                <div
                    v-for="option in options"
                    :key="option.id"
                    class="flex items-center whitespace-no-wrap text-sm menuWidth"
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
                            class="flex items-center justify-between w-full  hover:bg-blue200 py-2 px-3 text-primary"
                        >
                            <div class="flex-1">{{ option.label }}</div>
                            <div class="ml-4" v-if="isChecked">
                                <Icon icon="check" />
                            </div>
                        </div>
                    </Checkbox>
                </div>

                <div class="px-1 py-1 border-t ">
                    <Button
                        size="sm"
                        variant="primaryText"
                        @click="$emit('input', [])"
                        class="hover:underline"
                    >
                        Effacer
                    </Button>
                </div>
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

<style scoped="true">
.menuWidth {
    min-width: 220px;
}
</style>
