<template>
    <div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit, errors }">
            <Form class="mb-2" @submit.prevent="handleSubmit(onSubmit)">
                <div class="md:flex md:justify-between">
                    <TextInput
                        class="md:mr-6 md:w-1/3"
                        :label="$t('invitationPage.firstname')"
                        v-model="commonFields.first_name"
                        id="first_name"
                        name="Prénom"
                        rules="required|max:50"
                    />
                    <TextInput
                        class="md:mr-6 md:w-1/3"
                        :label="$t('invitationPage.lastname')"
                        v-model="commonFields.last_name"
                        id="last_name"
                        name="Nom de famille"
                        rules="required|max:50"
                    />
                    <TextInput
                        class="md:w-1/3"
                        :label="$t('invitationPage.email')"
                        v-model="commonFields.email"
                        id="email"
                        name="Email"
                        validationName="Email"
                        rules="required|max:125|email"
                    />
                </div>
                <div
                    v-if="
                        Object.values(errors).filter(err => err.length).length
                    "
                    class="bg-red200 justify-items-center md:mt-2 p-3 mb-8"
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

                <div class="text-right">
                    <Button type="submit" variant="primary" class="mb-8"
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
                first_name: "",
                last_name: ""
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
                this.commonFields.first_name = "";
                this.commonFields.last_name = "";
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
