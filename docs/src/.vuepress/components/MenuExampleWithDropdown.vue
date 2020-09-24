<template>
    <Dropdown>
        <template v-slot:button>
            <Button variant="primary" icon="chevron-down">Open</Button>
        </template>
        <template v-slot:menu>
            <Menu>
                <MenuItem>a</MenuItem>
                <MenuItem>b</MenuItem>
                <MenuItem>c</MenuItem>
            </Menu>
        </template>
    </Dropdown>
</template>
