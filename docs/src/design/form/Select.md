# Select
[Specs](https://www.sketch.com/s/6034ddd9-a0d3-4844-adda-bd4c821f24b1/a/m5QRWw)  

## Inputs without labels
<Select name="someInput" placeholder="Some text">
<SelectOption value="a">a</SelectOption>
<SelectOption value="b">b</SelectOption>
<SelectOption value="c">c</SelectOption>
</Select>

## Input with labels
<Select label="Some text" name="someInput" placeholder="A zip code">
<SelectOption value="a">a</SelectOption>
<SelectOption value="b">b</SelectOption>
<SelectOption value="c">c</SelectOption>
</Select>

## Input with labels & info
<Select label="Some text" name="someInput" info="some info" placeholder="A zip code">
<SelectOption value="a">a</SelectOption>
<SelectOption value="b">b</SelectOption>
<SelectOption value="c">c</SelectOption>
</Select>

## Input with labels & error
<Select label="Some text" name="someInput" error="an error" placeholder="A zip code">
<SelectOption value="a">a</SelectOption>
<SelectOption value="b">b</SelectOption>
<SelectOption value="c">c</SelectOption>
</Select>


```
<div>
    <Select v-model="selectValue">
        <SelectOption value="a">a</SelectOption>
        <SelectOption value="b">b</SelectOption>
        <SelectOption value="c">c</SelectOption>
    </Select>
    {{selectValue}}
</div>
```

