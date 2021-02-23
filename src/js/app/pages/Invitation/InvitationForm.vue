<template>
    <div>
        <div v-for="(guest, index) in this.list" :key="index">
            <ValidationObserver ref="form" v-slot="{ handleSubmit }">
                <Form class="mb-8" @submit.prevent="handleSubmit(onSubmit)">
                    <InputGroup class="md:flex">
                        <TextInput
                            class="md:-mb-8 md:mr-4 md:w-1/2"
                            :label="$t('invitationPage.firstname')"
                            v-model="commonFields.firstname"
                            id="first_name"
                            name="Prénom"
                            rules="required"
                        />
                        <TextInput
                            class="md:-mb-8 md:mr-4 md:w-1/2"
                            :label="$t('invitationPage.lastname')"
                            v-model="commonFields.lastname"
                            id="last_name"
                            name="Nom de famille"
                            rules="required"
                        />
                        <TextInput
                            class="md:-mb-8 md:w-1/2"
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
                            class="mb-8 -mt-4 md:-mt-4"
                        >
                            {{ $t("invitationPage.add") }}
                        </Button>
                    </div>
                </Form>
            </ValidationObserver>
        </div>
    </div>
</template>

<script>
export default {
    name: "InvitationForm",
    props: {
        guestList: {
            type: Array,
            required: false,
            default() {
                return [];
            }
        }
    },
    computed: {
        list() {
            return this.guestList;
        }
    },
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
                this.$emit("add-guest-req", { ...this.commonFields });
                // waiting until models are updated in the UI
                this.$nextTick(() => {
                    this.$refs.form.reset();
                });
            });
        }
    }
};
</script>
