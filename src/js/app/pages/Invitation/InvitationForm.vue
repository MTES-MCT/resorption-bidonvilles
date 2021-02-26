<template>
    <div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
            <Form class="mb-2" @submit.prevent="handleSubmit(onSubmit)">
                <InputGroup class="md:flex">
                    <TextInput
                        class="md:mr-4 md:w-1/2"
                        :label="$t('invitationPage.firstname')"
                        v-model="commonFields.firstname"
                        id="first_name"
                        name="Prénom"
                        rules="required"
                    />
                    <TextInput
                        class="md:mr-4 md:w-1/2"
                        :label="$t('invitationPage.lastname')"
                        v-model="commonFields.lastname"
                        id="last_name"
                        name="Nom de famille"
                        rules="required"
                    />
                    <TextInput
                        class="md:w-1/2"
                        :label="$t('invitationPage.email')"
                        v-model="commonFields.email"
                        id="email"
                        name="Email"
                        validationName="Email"
                        rules="required|email"
                    />
                </InputGroup>

                <div class="flex">
                    <Button
                        type="submit"
                        variant="primary"
                        class="mb-8 -mt-8 md:-mt-12"
                        >{{ $t("invitationPage.add") }}
                    </Button>
                </div>
            </Form>
        </ValidationObserver>
    </div>
</template>

<script>
export default {
    name: "InvitationForm",
    data() {
        return {
            loading: false,
            commonFields: {
                email: "",
                firstname: "",
                lastname: ""
            }
        };
    },
    methods: {
        onSubmit() {
            this.$refs.form.validate().then(success => {
                if (!success) {
                    return;
                }
                this.$emit("addGuestReq", { ...this.commonFields });
                // resetting values
                this.commonFields.firstname = "";
                this.commonFields.lastname = "";
                this.commonFields.email = "";
                // waiting until models are updated in the UI
                this.$nextTick(() => {
                    this.$refs.form.reset();
                });
            });
        }
    }
};
</script>
