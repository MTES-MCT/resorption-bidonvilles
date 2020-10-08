<template>
    <div>
        <CheckableGroup class="mt-4" title="Titre de la section">
            <Radio checkValue="a" label="a" v-model="radioValue" />
            <Radio checkValue="b" label="b" v-model="radioValue" />
            <Radio checkValue="c" label="c" v-model="radioValue" />
        </CheckableGroup>
        <CheckableGroup class="mt-16" title="Titre de la section (error)" info="Optional text helper" error="An error">
            <Radio checkValue="a" label="a" v-model="radioValue" info="microcopy supporting the label" />
            <Radio checkValue="b" label="b" v-model="radioValue" info="microcopy supporting the label" />
            <Radio checkValue="c" label="c" v-model="radioValue" info="microcopy supporting the label" />
        </CheckableGroup>
        <CheckableGroup class="mt-16" direction="row" title="Horizontal section (error)" info="Optional text helper" error="An error">
            <Radio checkValue="a" label="a" v-model="radioValue" />
            <Radio checkValue="b" label="b" v-model="radioValue" />
            <Radio checkValue="c" label="c" v-model="radioValue" />
        </CheckableGroup>
    </div>
</template>

<script>
    export default {
        name: 'CheckboxExample',
        data() {
            return {
                radioValue: null
            }

        }
    }
</script>
