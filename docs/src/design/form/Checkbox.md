# Checkbox
[Specs](https://www.sketch.com/s/6034ddd9-a0d3-4844-adda-bd4c821f24b1/a/aK34ez)

## Example

<Checkbox-Example />

```
<div>
    <div>
        <Checkbox checkValue="a" label="a" v-model="checkboxValue" />
        <Checkbox checkValue="b" label="b" v-model="checkboxValue" />
        <Checkbox checkValue="c" label="c" v-model="checkboxValue" />
    </div>
    {{checkboxValue}}
</div>
```

## With CheckableGroup

<Checkbox-GroupExample />

```
<CheckableGroup title="Titre de la section">
    <Checkbox checkValue="a" label="a" v-model="checkboxValue" />
    <Checkbox checkValue="b" label="b" v-model="checkboxValue" />
    <Checkbox checkValue="c" label="c" v-model="checkboxValue" />
</CheckableGroup>

<CheckableGroup title="Titre de la section" info="Optional text helper" error="An error">
    <Checkbox checkValue="a" label="a" v-model="checkboxValue" info="microcopy supporting the label" />
    <Checkbox checkValue="b" label="b" v-model="checkboxValue" info="microcopy supporting the label" />
    <Checkbox checkValue="c" label="c" v-model="checkboxValue" info="microcopy supporting the label" />
</CheckableGroup>
```
