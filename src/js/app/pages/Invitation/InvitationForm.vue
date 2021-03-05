<template>
    <div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit, errors }">
            <Form class="mb-2" @submit.prevent="handleSubmit(onSubmit)">
                <InputGroup class="md:flex md:justify-center">
                    <TextInput
                        class="md:mr-6 md:w-1/4"
                        :label="$t('invitationPage.firstname')"
                        v-model="commonFields.firstname"
                        id="first_name"
                        name="Prénom"
                        rules="required|max:50"
                    />
                    <TextInput
                        class="md:mr-6 md:w-1/4"
                        :label="$t('invitationPage.lastname')"
                        v-model="commonFields.lastname"
                        id="last_name"
                        name="Nom de famille"
                        rules="required|max:50"
                    />
                    <TextInput
                        class="md:w-1/4"
                        :label="$t('invitationPage.email')"
                        v-model="commonFields.email"
                        id="email"
                        name="Email"
                        validationName="Email"
                        rules="required|max:125|email"
                    />
                </InputGroup>
                <div
                    v-if="
                        Object.values(errors).filter(err => err.length).length
                    "
                    class="bg-red200 justify-items-center -mt-4 md:-mt-8 p-3 mb-16"
                >
                    {{ $t("contactPage.error") }}

                    <ul class="mt-4">
                        <li
                            v-for="(error, inputId) in errors"
                            :key="inputId"
                            v-show="error.length"
                        >
                            <router-link class="link" :to="{ hash: inputId }">
                                {{ error[0] }}
                            </router-link>
                        </li>
                    </ul>
                </div>

                <div class="flex flex-row-reverse">
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
