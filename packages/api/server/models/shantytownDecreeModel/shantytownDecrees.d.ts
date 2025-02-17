export type ShantytownDecree = {
    shantytownDecreeId: number,
    attachmentId: number,
    shantytownId: number,
    attachmentType: string,
    decreeType: string,
    fileKey: string,
    previewFileKey: string | null,
    originalName: string,
    type: string,
    size: number,
    createdAt: Date,
    createdBy: number,
};
