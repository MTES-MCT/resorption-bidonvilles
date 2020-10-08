# Button

[Specs](https://www.sketch.com/s/6034ddd9-a0d3-4844-adda-bd4c821f24b1/a/P4wOW1)

## Variantes


<Button class="m-2">default</Button>
<Button class="m-2" variant="primary">primary</Button>
<Button class="m-2" variant="secondary">secondary</Button>
<Button class="m-2" variant="primaryOutline">primary outline</Button>
<Button class="m-2" variant="secondaryOutline">secondary outline</Button>
<Button class="m-2" variant="primaryText">primary text</Button>
<Button class="m-2" variant="secondaryText">secondary text</Button>
<Button class="m-2" disabled>primary disabled</Button>
<Button class="m-2" disabled variant="primaryOutline">primary outline disabled</Button>
<Button class="m-2" disabled variant="primaryText">primary text disabled</Button>

```
<Button>Button default</Button>
<Button variant="primary">Button primary</Button>
<Button variant="secondary">Button secondary</Button>
<Button variant="primaryOutline">Button primary outline</Button>
<Button variant="secondaryOutline">Button primary outline</Button>
<Button variant="primaryText">Button primary outline</Button>
<Button variant="secondaryText">Button primary outline</Button>
```

## Taille
<Button size="sm">Button small</Button>
<Button>Button default</Button>
<Button size="md">Button medium</Button>
<Button size="lg">Button large</Button>

```
<Button size="sm">Button default</Button>
<Button>Button default</Button>
<Button size="md">Button medium</Button>
<Button size="lg">Button large</Button>
```

## Icon Button

<Button icon="users" />
<Button icon="users" iconPosition="right">Button with right icon</Button>
<Button icon="users" iconPosition="left">Button with left icon</Button>

```
<Button icon="users" />
<Button icon="users" iconPosition="right">Button with right icon</Button>
<Button icon="users" iconPosition="left">Button with left icon</Button>
```

## Link Button

<Button variant="primaryText" icon="chevron-right" href="https://www.example.com">Example</Button>

```
<Button variant="primaryText" icon="chevron-right" href="https://www.example.com">Example</Button>

```


## Loading Button

<Button-LoadingExample />

```
<Button variant="primary" :loading="loading" @click="onClick">Click me</Button>
<Button variant="primaryOutline" :loading="loading" @click="onClick">Click me</Button>
<Button variant="primaryText" :loading="loading" @click="onClick">Click me</Button>
```



