<template>
    <div class="w-full max-w-xs">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" @submit.prevent="onSubmit" >
            <FormGroup label="Username" :error="errors.username">
                <TextInput id="username" type="text" placeholder="Username" v-model="username" />
            </FormGroup>
            <FormGroup label="Password" :error="errors.password">
                <TextInput id="password" type="password" placeholder="******************" v-model="password" />
            </FormGroup>

            <div class="flex items-center justify-between">
                <Button variant="primary" type="submit">
                    Sign in
                </Button>
                <Button variant="secondary">
                    Forgot password?
                </Button>
            </div>
        </form>
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
