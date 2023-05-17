export type FileAttachment = {
    state: 'uploaded',
    id: number,
    name: string,
    size: number,
    urls: {
        original: string,
        preview: string,
    },
    extension: string,
    created_by: number,
};
