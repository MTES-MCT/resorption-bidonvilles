<template>
    <div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit, errors }">
            <Form class="mb-8" @submit.prevent="handleSubmit(onSubmit)">
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
                <div
                    v-if="
                        Object.values(errors).filter(err => err.length).length
                    "
                    class="bg-red-200 p-3 mb-8"
                >
                    {{ $t("contactPage.error") }}

                    <ul class="mt-4">
                        <li
                            v-for="(error, inputId) in errors"
                            :key="inputId"
                            v-show="error.length"
                        >
                            <router-link class="link" :to="{ hash: inputId }">{{
                                error[0]
                            }}</router-link>
                        </li>
                    </ul>
                </div>

                <div class="flex">
                    <Button type="submit" variant="primary" size="sm"
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
                email: this.$route.query.email || "",
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
