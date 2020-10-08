# User Info Example

Example inspired from [tailwind](https://tailwindcss.com/components/forms#form-grid)

<FormGridExample />

```
<template>
    <form class="w-full max-w-xl" @submit.prevent="onSubmit">
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div class="flex flex-wrap -mx-3">
                <div class="w-1/2 px-3">
                    <CheckableGroup title="Title" :error="errors.title" direction="row">
                        <Radio label="Mr" checkValue="mr" v-model="title" />
                        <Radio label="Ms" checkValue="ms" v-model="title" />
                        <Radio label="Mlle" checkValue="mlle" v-model="title" />
                    </CheckableGroup>
                </div>
                <div class="w-1/2 px-3">
                    <CheckableGroup title="Test" :error="errors.test" direction="row">
                        <Checkbox label="a" checkValue="a"  v-model="test" />
                        <Checkbox label="b" checkValue="b" v-model="test" />
                        <Checkbox label="c" checkValue="c" v-model="test" />
                    </CheckableGroup>
                </div>
                <div class="w-1/2 px-3">
                    <TextInput type="text" placeholder="Jane" v-model="firstName" label="First Name" :error="errors.firstName"/>
                </div>
                <div class="w-1/2 px-3">
                    <TextInput type="text" placeholder="Doe" v-model="lastName" label="Last Name" :error="errors.lastName" />
                </div>
            </div>
            <TextInput id="password" type="password" placeholder="******************" v-model="password" label="Password" :error="errors.password" />

            <div class="flex flex-wrap -mx-3">
                <div class="px-3 w-1/3">
                    <TextInput id="city" placeholder="Albuquerque" v-model="city" label="City" :error="errors.city" />
                </div>
                <div class="px-3 w-1/3">
                    <Select v-model="state" label="State" :error="errors.state">
                        <SelectOption value="mexico">New Mexico</SelectOption>
                        <SelectOption value="missouri">Missouri</SelectOption>
                        <SelectOption value="texas">Texas</SelectOption>
                    </Select>
                </div>
                <div class="px-3 w-1/3">
                    <TextInput id="zip" placeholder="90210" v-model="zip" label="Zip" :error="errors.zip" />
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
```
