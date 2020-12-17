<template>
    <div>
        <div class="mb-2">Trier par</div>
        <div class="flex items-center">
            <Dropdown>
                <template v-slot:button="{ isOpen }">
                    <Button
                        variant="custom"
                        size="sm"
                        :icon="isOpen ? 'chevron-up' : 'chevron-down'"
                        iconPosition="right"
                        :class="[
                            'px-4 rounded focus:outline-none border border-primary whitespace-nowrap ',
                            isOpen
                                ? 'bg-primary text-white hover:text-white focus:text-white'
                                : 'hover:bg-blue200 hover:text-primary text-primary'
                        ]"
                        >{{ title }}
                    </Button>
                </template>
                <template v-slot:menu>
                    <Menu containerClasses="py-0">
                        <div
                            v-for="option in options"
                            :key="option.id"
                            class="flex items-center whitespace-no-wrap text-sm menuWidth"
                        >
                            <Radio
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
                            </Radio>
                        </div>
                    </Menu>
                </template>
            </Dropdown>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: String
        }
    },
    data() {
        return {
            options: [
                {
                    value: `builtAt`,
                    label: `Date d'installation`
                },
                {
                    value: `updatedAt`,
                    label: `Date d'actualisation`
                },
                {
                    value: `createdAt`,
                    label: `Date de signalement`
                }
            ]
        };
    },
    computed: {
        title() {
            const option = this.options.find(
                option => option.value === this.value
            );

            return option.label;
        }
    }
};
</script>

<style scoped="true">
.menuWidth {
    min-width: 190px;
}
</style>
