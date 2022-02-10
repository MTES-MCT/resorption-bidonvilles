<template>
    <FormGroup title="Intervention">
        <FormParagraph title="Nom du dispositif" :showMandatoryStar="true">
            <InputName v-model="input.name"></InputName>
        </FormParagraph>

        <FormParagraph
            title="Département d'intervention principal"
            :showMandatoryStar="true"
        >
            <div class="w-64">
                <InputDepartement
                    v-model="input.departement"
                    :disabled="mode !== 'create'"
                ></InputDepartement>
            </div>
        </FormParagraph>

        <FormParagraph title="Quelles sont les dates clés du dispositif ?">
            <div class="w-64">
                <InputStartedAt
                    v-model="input.started_at"
                    :disableAfter="input.expected_to_end_at"
                ></InputStartedAt>
                <InputExpectedToEndAt
                    v-model="input.expected_to_end_at"
                    :disableBefore="input.started_at"
                ></InputExpectedToEndAt>
            </div>

            <InputInAndOut
                v-model="input.in_and_out"
                :disabled="mode !== 'create'"
            />
            <InputTopics v-model="input.topics" :disabled="mode !== 'create'" />
            <InputGoals v-model="input.goals" />
        </FormParagraph>
    </FormGroup>
</template>

<script>
import InputName from "./inputs/InputName.vue";
import InputDepartement from "./inputs/InputDepartement.vue";
import InputStartedAt from "./inputs/InputStartedAt.vue";
import InputExpectedToEndAt from "./inputs/InputExpectedToEndAt.vue";
import InputInAndOut from "./inputs/InputInAndOut.vue";
import InputTopics from "./inputs/InputTopics.vue";
import InputGoals from "./inputs/InputGoals.vue";

export default {
    props: {
        value: {
            type: Object,
            required: true
        },
        mode: {
            type: String,
            required: true
        }
    },

    components: {
        InputName,
        InputDepartement,
        InputStartedAt,
        InputExpectedToEndAt,
        InputInAndOut,
        InputTopics,
        InputGoals
    },

    data() {
        return {
            input: this.value
        };
    }
};
</script>
