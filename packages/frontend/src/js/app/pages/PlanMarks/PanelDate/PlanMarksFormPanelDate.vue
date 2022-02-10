<template>
    <FormGroup title="Date d'actualisation des données">
        <FormParagraph
            title="À quelle date correspondent les données que vous souhaitez saisir ?"
            :showMandatoryStar="true"
        >
            <div class="w-64">
                <InputDate v-model="input" :minDate="minDate"></InputDate>
            </div>
        </FormParagraph>
    </FormGroup>
</template>

<script>
import InputDate from "./inputs/InputDate.vue";

export default {
    props: {
        value: {
            type: Date,
            required: false
        },
        plan: {
            type: Object,
            required: true
        }
    },

    components: {
        InputDate
    },

    data() {
        return {
            input: this.value
        };
    },

    computed: {
        minDate() {
            if (this.plan.states.length === 0) {
                return;
            }

            const d = new Date(this.plan.states.slice(-1)[0].date);
            d.setDate(d.getDate() + 1);
            return d;
        }
    },

    watch: {
        input() {
            this.$emit("input", this.input);
        }
    }
};
</script>
