# SidePanel

<SidePanelExample />

```
<div>
    <Button @click="isOpen = !isOpen">{{isOpen ? 'Close' : 'Open'}}</Button>
    <SidePanel :isOpen="isOpen" :closePanel="closePanel">
        <div class="text-xl">Heading</div>
    </SidePanel>
</div>
```
