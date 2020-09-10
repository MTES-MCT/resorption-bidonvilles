<template>
    <div class="page--withMargin">
        <NavBar></NavBar>
        <Form v-bind="formDefinition" v-model="data" @complete="onComplete" @stepcomplete="onStepComplete" ref="form"></Form>
    </div>
</template>

<script>
import NavBar from '#app/layouts/navbar/navbar.vue';
import Form from '#app/components/form/form.vue';
import getFormDefinition from "./getFormDefinition";

export default {
    components: {
        NavBar,
        Form,
    },
    data() {
        return {
            data: {},
            formDefinition: getFormDefinition(),
        };
    },
    methods: {
        onStepComplete(index, stepData) {
            if (index === 0) {
                if (!stepData.plans || stepData.plans.length === 0) {
                    this.$nextTick(() => {
                        this.$refs.form.goToNextStep(null);
                    });
                }
            }
        },
        onComplete(stepData, [{ town: { id } }]) {
            this.$router.push(`/site/${id}`);
        },
    },
};

</script>

<style lang="scss" scoped>
    @import '/css/config/colors.scss';

    .mandatory {
        font-weight: bold;
        color: #d63626;
    }

    .breadcrumbs > ul {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        margin: 0 0 30px;
        padding: 0;
        list-style: none;
    }

    $STEP_HEIGHT: 30px;

    .breadcrumbs-step {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        color: #adb9c9;
        line-height: $STEP_HEIGHT;
        text-align: center;

        > span {
            display: inline-block;
            margin-right: 10px;
            width: $STEP_HEIGHT;
            height: $STEP_HEIGHT;
            border: 1px solid #adb9c9;
            border-radius: 50%;
            text-align: center;
            line-height: $STEP_HEIGHT - 2;
        }

        &.active,
        &.done {
            cursor: pointer;
            color: #003b80;

            > span {
                color: #fff;
                background: #003b80;
                border-color: #003b80;
            }
        }

        &:not(:last-child) {
            -webkit-box-flex: 1;
            -ms-flex-positive: 1;
            flex-grow: 1;

            &::after {
                margin-left: 20px;
                content: '';
                display: inline-block;
                height: $STEP_HEIGHT / 2;
                border-bottom: 1px solid #adb9c9;
                -webkit-box-flex: 1;
                -ms-flex-positive: 1;
                flex-grow: 1;
                vertical-align: middle;
            }

            &.done {
                &::after {
                    border-bottom-color: #003b80;
                }
            }
        }
    }

    .panel .form__group > label,
    .panel .form__group fieldset > legend {
        font-weight: bold;
    }

    .vdp-datepicker input {
        max-width: 300px;
    }

    .panel input[type="number"] {
        max-width: 100px;
    }

    legend.error {
        font-weight: bold;
        color: #d63626;
    }

    p.error {
        margin-top: 0;

        & > ul {
            margin-top: 0;
            padding-left: 20px;
            color: #d63626;
        }
    }
</style>
