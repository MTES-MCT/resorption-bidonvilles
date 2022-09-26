import TagList from './TagList.vue';
import Button from './Button.vue';

export default {
    title: 'TagList',
    component: TagList
};

export const EmptyTagList = () => ({
    components: { TagList },
    template: '<TagList />'
});

export const SimpleTagList = () => ({
    components: { TagList },
    template: `<TagList :tags="tags" />`,
    data() {
        return {
            tags: [
                { id: 'a', label: 'A'},
                { id: 'b', label: 'B'},
                { id: 'c', label: 'C'},
            ]
        };
    },
});


export const DeletableTagList = () => ({
    components: { TagList, Button },
    template: `<div>
        <TagList :tags="tags" :onDelete="deleteTag" />
        <Button @click.native="addTag">Ajouter le tag "X"</Button>
    </div>`,
    data() {
        return {
            tags: [
                { id: 'a', label: 'A'},
                { id: 'b', label: 'B'},
                { id: 'c', label: 'C'},
            ]
        };
    },
    methods: {
        addTag() {
            if (!this.tags.map(({ id }) => id).includes('x')) {
                this.tags.push({ id: 'x', label: 'X' });
            }
        },
        deleteTag(tagId) {
            const index = this.tags.findIndex(({ id }) => id === tagId);
            if (index !== undefined) {
                this.tags.splice(index, 1);
            }
        }
    }
});
