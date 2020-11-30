<template>
    <div class="w-full max-w-xs max-w-xl">
        <ValidationObserver ref="form" v-slot="{ handleSubmit, errors, failed }">
            <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" @submit.prevent="handleSubmit(onSubmit)" >
                <TextInput id="username" type="text" placeholder="Username" v-model="username" label="Username" :error="errors.username" rules="required"/>
                <TextInput id="password" type="password" placeholder="******************" v-model="password" label="Password" :error="errors.password" rules="required"/>

                <div class="flex items-center justify-between">
                    <Button variant="primary" type="submit">
                        Sign in
                    </Button>
                    <Button variant="primaryText">
                        Forgot password?
                    </Button>
                </div>
            </form>
        </ValidationObserver>
    </div>
</template>


<script>
    export default {
        name: 'FormInfoExample',
        data() {
            return {
                username: '',
                password: '',
                errors: {
                    username: null,
                    password: null
                }
            }
        },
        methods: {
            onSubmit() {
                this.errors.username = this.username ? null : 'Please choose a username.'
                this.errors.password = this.password ? null : 'Please choose a password.'

                if (this.username && this.password) {
                    alert(`Submit with values : ${this.username} / ${this.password}`)
                }

            }
        }
    }
</script>
