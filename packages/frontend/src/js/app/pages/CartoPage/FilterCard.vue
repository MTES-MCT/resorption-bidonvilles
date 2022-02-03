<template>
    <div class="filterGroup">
        <main>
            <Icon class="mr-3" :icon="filter.faIcon"></Icon>
            <h1 class="inline-block" @click="toggle">
                {{ filter.label }} <Icon :icon="togglerIcon"></Icon>
            </h1>
            <div class="ml-5" v-if="visible">
                <div v-for="(option, index) in filter.options" :key="index">
                    <input
                        class="cursor-pointer"
                        v-model="option.checked"
                        type="checkbox"
                        :id="id + '-' + (option.id || index)"
                        :value="option.value"
                    />
                    <label
                        class="cursor-pointer"
                        :for="id + '-' + (option.id || index)"
                    >
                        <font-awesome-icon
                            v-if="option.icon !== undefined"
                            :icon="option.icon.id"
                            :style="{ color: '#' + option.icon.color }"
                            fixed-width
                        >
                        </font-awesome-icon>
                        <span>{{ option.label }}</span> </label
                    ><br />
                    <!-- <Checkbox :checkValue="option.value" :id="id + '-' + (option.id || index)" :label="option.label" v-model="option.checked">
                    </Checkbox> -->
                </div>
            </div>
        </main>
    </div>
</template>

<script>
export default {
    props: {
        filter: {
            type: Object
        },
        id: String
    },
    data() {
        return {
            visible: this.filter.opened
        };
    },
    computed: {
        togglerIcon() {
            if (this.visible) {
                return "chevron-up";
            }

            return "chevron-down";
        }
    },
    methods: {
        toggle() {
            this.visible = !this.visible;
        }
    }
};
</script>

<style lang="scss" scoped>
.filterGroup {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;

    padding: 20px 0;
    border-color: #13213f;
    border-style: solid;
    border-width: 0 0 1px;

    > main {
        padding-left: 30px;

        > h1 {
            margin: 0 0 10px;
            padding: 0;
            letter-spacing: 0.05em;
            cursor: pointer;
        }
        input[type="checkbox"] {
            width: 17px;
            height: 17px;
        }
    }
}
</style>
