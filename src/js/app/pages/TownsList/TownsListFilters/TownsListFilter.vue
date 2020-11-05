<template>
    <Dropdown>
        <template v-slot:button>
            <Button variant="filter" size="sm">{{ title }}</Button>
        </template>
        <template v-slot:menu>
            <Menu class="p-3 py-3">
                <div
                    v-for="option in options"
                    :key="option.id"
                    class="flex items-center whitespace-no-wrap text-sm"
                >
                    <Checkbox
                        :label="option.label"
                        :checkValue="option.value"
                        :value="value"
                        @input="$emit('input', $event)"
                    />
                </div>

                <Button size="sm" variant="textPrimary" class="mt-4">
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
    }
};
</script>
