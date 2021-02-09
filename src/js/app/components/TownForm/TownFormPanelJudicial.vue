<template>
    <FormGroup title="Procédure judiciaire">
        <FormParagraph
            title="Une plainte a-t-elle été déposée par le propriétaire ?"
            showMandatoryStar="true"
        >
            <InputOwnerComplaint
                v-model="input.owner_complaint"
            ></InputOwnerComplaint>
        </FormParagraph>

        <FormParagraph title="Une procédure judiciaire est-elle en cours ?">
            <InputJusticeProcedure
                v-model="input.justice_procedure"
            ></InputJusticeProcedure>
            <InputJusticeRendered
                v-model="input.justice_rendered"
                v-if="input.justice_procedure === 1"
            ></InputJusticeRendered>

            <div class="w-64">
                <InputJusticeRenderedAt
                    v-model="input.justice_rendered_at"
                    v-if="input.justice_rendered === 1"
                ></InputJusticeRenderedAt>
            </div>

            <div class="w-128">
                <InputJusticeRenderedBy
                    v-model="input.justice_rendered_by"
                    v-if="input.justice_rendered === 1"
                ></InputJusticeRenderedBy>
            </div>

            <InputJusticeChallenged
                v-model="input.justice_challenged"
                v-if="input.justice_rendered === 1"
            ></InputJusticeChallenged>

            <!-- police -->
            <InputPoliceStatus
                v-model="input.police_status"
                ref="policeStatus"
            ></InputPoliceStatus>

            <div class="w-64">
                <InputPoliceRequestedAt
                    v-model="input.police_requested_at"
                    v-if="policeWasRequested"
                ></InputPoliceRequestedAt>
            </div>

            <div class="w-64">
                <InputPoliceGrantedAt
                    v-model="input.police_granted_at"
                    v-if="policeWasGranted"
                ></InputPoliceGrantedAt>
            </div>

            <!-- bailiff -->
            <div class="w-128">
                <InputBailiff v-model="input.bailiff"></InputBailiff>
            </div>
        </FormParagraph>
    </FormGroup>
</template>

<script>
import InputOwnerComplaint from "./inputs/InputOwnerComplaint.vue";
import InputJusticeProcedure from "./inputs/InputJusticeProcedure.vue";
import InputJusticeRendered from "./inputs/InputJusticeRendered.vue";
import InputJusticeRenderedAt from "./inputs/InputJusticeRenderedAt.vue";
import InputJusticeRenderedBy from "./inputs/InputJusticeRenderedBy.vue";
import InputJusticeChallenged from "./inputs/InputJusticeChallenged.vue";
import InputPoliceStatus from "./inputs/InputPoliceStatus.vue";
import InputPoliceRequestedAt from "./inputs/InputPoliceRequestedAt.vue";
import InputPoliceGrantedAt from "./inputs/InputPoliceGrantedAt.vue";
import InputBailiff from "./inputs/InputBailiff.vue";

export default {
    components: {
        InputOwnerComplaint,
        InputJusticeProcedure,
        InputJusticeRendered,
        InputJusticeRenderedAt,
        InputJusticeRenderedBy,
        InputJusticeChallenged,
        InputPoliceStatus,
        InputPoliceRequestedAt,
        InputPoliceGrantedAt,
        InputBailiff
    },

    props: {
        value: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            input: this.value
        };
    },

    computed: {
        policeWasRequested() {
            const value = this.input.police_status;
            return value === "requested" || value === "granted";
        },

        policeWasGranted() {
            const value = this.input.police_status;
            return value === "granted";
        }
    }
};
</script>
