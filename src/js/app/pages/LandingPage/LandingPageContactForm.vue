<template>
    <form
        class="flex flex-row justify-center mt-4 w-full max-w-md"
        @submit.prevent="onSubmit"
    >
        <input
            class="hidden md:block border-2 border-G200 rounded-md flex-1 py-2 px-4 outline-none focus:border-G400"
            :placeholder="$t('landingPage.contactForm.email')"
            v-model="email"
        />
        <Button type="submit" variant="secondary" class="ml-1">{{
            $t("landingPage.contactForm.cta")
        }}</Button>
    </form>
</template>

<script>
export default {
    data() {
        return {
            email: ""
        };
    },
    methods: {
        onSubmit() {
            this.$router.push(
                `/contact${
                    this.email ? `?email=${encodeURIComponent(this.email)}` : ""
                }`
            );
        }
    }
};
</script>
