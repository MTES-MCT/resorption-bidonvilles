<template>
    <InputShantytowns
        id="location_shantytowns"
        label="Sites concernés"
        validationName="Sites concernés"
        :showMandatoryStar="true"
        rules="required"
        v-model="input"
    >
        <template v-slot:info
            >Merci de sélectionner les sites concernés par le dispositif. Si
            vous ne trouvez pas un site, vous pouvez
            <router-link class="link" to="/nouveau-site" target="_blank"
                >déclarer un nouveau site</router-link
            >.</template
        >
    </InputShantytowns>
</template>

<script>
import InputShantytowns from "#app/components/InputShantytowns/InputShantytowns.vue";

export default {
    props: {
        value: {
            type: Array,
            required: false,
            default() {
                return [];
            }
        }
    },

    components: {
        InputShantytowns
    },

    data() {
        return {
            input: this.value
        };
    },

    watch: {
        value() {
            this.input = this.value;
        },

        input() {
            this.$emit("input", this.input);
        }
    }
};
</script>
