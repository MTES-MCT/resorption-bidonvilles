export type File = {
    state: string,
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
