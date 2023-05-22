import { File } from '#server/models/attachmentModel/File.d';

export type Answer = {
    id: number,
    description: string,
    createdAt: number | null,
    createdBy: {
        id: number,
        first_name: string,
        last_name: string,
        role: string,
        position: string,
        organization: string,
        organization_id: number,
    },
    question: number,
    attachments: File[],
};
