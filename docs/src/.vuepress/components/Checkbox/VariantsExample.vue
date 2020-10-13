<template>
    <div>
        <CheckableGroup class="mt-4" title="Checkbox default Vertical">
            <Checkbox v-for="option in options" :checkValue="option" :label="option" v-model="checkboxValue" />
        </CheckableGroup>

        <CheckableGroup class="mt-4" title="Checkbox default Row" direction="row">
            <Checkbox v-for="option in options" :checkValue="option" :label="option" v-model="checkboxValue" />
        </CheckableGroup>

        <CheckableGroup class="mt-4" title="Radio default Vertical">
            <Radio v-for="option in options" :checkValue="option" :label="option" v-model="checkboxValue" />
        </CheckableGroup>

        <CheckableGroup class="mt-4" title="Radio default Row" direction="row">
            <Radio v-for="option in options" :checkValue="option" :label="option" v-model="checkboxValue" />
        </CheckableGroup>

        <CheckableGroup class="mt-4" title="Card Vertical (Checkbox/Radio)">
            <Checkbox v-for="option in options" :checkValue="option" :label="option" v-model="checkboxValue" variant="card" />
        </CheckableGroup>

        <CheckableGroup class="mt-4" title="Card Row (Checkbox/Radio)" direction="row" >
            <Checkbox v-for="option in options" :checkValue="option" :label="option" v-model="checkboxValue" variant="card" />
        </CheckableGroup>

    </div>
</template>

<script>
    export default {
        name: 'CheckboxExample',
        data() {
            return {
                checkboxValue: [],
                options: ['label a', 'label b', 'label c']
            }

        }
    }
</script>
