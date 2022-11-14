<template>
    <div>
        <div class="flex">
            <div class="text-center align-middle mb-4 mr-2">
                <Icon class="align-middle rounded-full " icon="calendar"></Icon>
            </div>
            <p>
                Les informations que je mets à jour correspondent à la situation
                du site aujourd'hui
            </p>
        </div>
        <CheckableGroup direction="horizontal" rules="required">
            <Radio
                variant="card"
                label="Oui"
                v-model="checked"
                :checkValue="1"
            ></Radio>
            <Radio
                variant="card"
                label="Non"
                v-model="checked"
                :checkValue="0"
            ></Radio>
        </CheckableGroup>

        <InputUpdatedAt
            v-if="checked !== 1"
            v-model="updatedAt"
            :disableBefore="disableBefore"
            :disableAfter="new Date(new Date().valueOf() - 1000 * 3600 * 24)"
        ></InputUpdatedAt>
    </div>
</template>

<script>
import InputUpdatedAt from "./inputs/InputUpdatedAt.vue";

export default {
    components: {
        InputUpdatedAt
    },

    props: {
        value: {
            type: Date,
            required: true
        },

        disableBefore: {
            type: Date,
            required: false
        }
    },

    data() {
        return {
            checked: 1,
            updatedAt: this.value
        };
    },
    watch: {
        updatedAt() {
            this.updatedAt.setHours(0, 0, 0, 0);
            this.$emit("input", this.updatedAt);
        }
    }
};
</script>
