<template>
    <div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit, errors, failed }">
            <form class="w-full max-w-xl" @submit.prevent="handleSubmit(onSubmit)">
                <DatepickerV2 label="Date" v-model="date" rules="required"></DatepickerV2>
                <div v-if="date">result: {{date}}</div>
                <Button type="submit">Submit</Button>
            </form>
        </ValidationObserver>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                date: null
            }
        },
        methods: {
            handleSubmit() {
                alert(this.date)
            }
        }
    }
</script>
