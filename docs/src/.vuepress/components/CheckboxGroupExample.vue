<template>
    <div>
        <CheckableGroup class="mt-4" title="Titre de la section">
            <Checkbox checkValue="a" label="a" v-model="checkboxValue" />
            <Checkbox checkValue="b" label="b" v-model="checkboxValue" />
            <Checkbox checkValue="c" label="c" v-model="checkboxValue" />
        </CheckableGroup>
        <CheckableGroup class="mt-16" title="Titre de la section (error)" info="Optional text helper" error="An error">
            <Checkbox checkValue="a" label="a" v-model="checkboxValue" info="microcopy supporting the label" />
            <Checkbox checkValue="b" label="b" v-model="checkboxValue" info="microcopy supporting the label" />
            <Checkbox checkValue="c" label="c" v-model="checkboxValue" info="microcopy supporting the label" />
        </CheckableGroup>
        <CheckableGroup class="mt-16" direction="row" title="Horizontal section (error)" info="Optional text helper" error="An error">
            <Checkbox checkValue="a" label="a" v-model="checkboxValue" />
            <Checkbox checkValue="b" label="b" v-model="checkboxValue" />
            <Checkbox checkValue="c" label="c" v-model="checkboxValue" />
        </CheckableGroup>
    </div>
</template>

<script>
    export default {
        name: 'CheckboxExample',
        data() {
            return {
                checkboxValue: []
            }

        }
    }
</script>
