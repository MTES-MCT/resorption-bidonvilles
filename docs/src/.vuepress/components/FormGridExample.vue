<template>
    <form class="w-full max-w-lg" @submit.prevent="onSubmit">
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div class="flex flex-wrap -mx-3">
                <div class="w-1/2 px-3">
                    <FormGroup label="Title" :error="errors.title">
                        <div>
                            <Radio label="Mr" checkValue="mr" v-model="title" />
                            <Radio label="Ms" checkValue="ms" v-model="title" />
                            <Radio label="Mlle" checkValue="mlle" v-model="title" />
                        </div>
                    </FormGroup>
                </div>
                <div class="w-1/2 px-3">
                    <FormGroup label="Test" :error="errors.test">
                        <div>
                            <Checkbox label="test a" checkValue="a"  v-model="test" />
                            <Checkbox label="test b" checkValue="b" v-model="test" />
                            <Checkbox label="test c" checkValue="c" v-model="test" />
                        </div>
                    </FormGroup>
                </div>
                <div class="w-1/2 px-3">
                    <FormGroup label="First Name" :error="errors.firstName">
                        <TextInput type="text" placeholder="Jane" v-model="firstName"/>
                    </FormGroup>
                </div>
                <div class="w-1/2 px-3">
                    <FormGroup label="Last Name" :error="errors.lastName">
                        <TextInput type="text" placeholder="Doe" v-model="lastName" />
                    </FormGroup>
                </div>
            </div>
            <FormGroup label="Password" :error="errors.password">
                <TextInput id="password" type="password" placeholder="******************" v-model="password" />
            </FormGroup>

            <div class="flex flex-wrap -mx-3">
                <div class="px-3 w-1/3">
                    <FormGroup label="City" :error="errors.city">
                        <TextInput id="city" placeholder="Albuquerque" v-model="city" />
                    </FormGroup>
                </div>
                <div class="px-3 w-1/3">
                    <FormGroup label="City"  :error="errors.state">
                        <Select v-model="state">
                            <SelectOption value="mexico">New Mexico</SelectOption>
                            <SelectOption value="missouri">Missouri</SelectOption>
                            <SelectOption value="texas">Texas</SelectOption>
                        </Select>
                    </FormGroup>
                </div>
                <div class="px-3 w-1/3">
                    <FormGroup label="Zip" :error="errors.zip">
                        <TextInput id="zip" placeholder="90210" v-model="zip" />
                    </FormGroup>
                </div>
            </div>
            <Button type="submit">Submit</Button>
        </div>
    </form>
</template>


<script>
    export default {
        name: 'FormInfoExample',
        data() {
            return {
                title: 'mr',
                test: ['a', 'b'],
                firstName: '',
                lastName: '',
                password: '',
                city: '',
                state: '',
                zip: '',
                errors: {}
            }
        },
        methods: {
            onSubmit() {
                const data = {
                    title: this.title,
                    test: this.test,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    password: this.password,
                    city: this.city,
                    state: this.state,
                    zip: this.zip
                }
                console.log(data);
            }
        }
    }
</script>
