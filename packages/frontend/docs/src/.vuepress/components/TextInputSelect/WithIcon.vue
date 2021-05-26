<template>
    <div>
        <TextInput label="some text" prefixIcon="users" name="someInput" placeholder="Some text" />
        <TextInput label="avec icone a droite" suffixIcon="users" name="someInput" placeholder="Some text" />
        <TextArea label="text area" prefixIcon="users" name="someInput" placeholder="Text Area" />
        <TextInput label="a number input" prefixIcon="users" name="someInput" placeholder="A number input" type="number" />
        <Select label="select input" icon="users" >
            <SelectOption value="a">a</SelectOption>
            <SelectOption value="b">b</SelectOption>
            <SelectOption value="c">c</SelectOption>
        </Select>
    </div>
</template>
