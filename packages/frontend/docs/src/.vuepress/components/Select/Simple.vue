<template>
    <div>
        <Select v-model="selectValue">
            <SelectOption value="a">a</SelectOption>
            <SelectOption value="b">b</SelectOption>
            <SelectOption value="c">c</SelectOption>
        </Select>
        {{selectValue}}
    </div>
</template>

<script>
    export default {
        data() {
            return {
                selectValue: 'a'
            }
        }
    }
</script>
