export type GenericAnswer = {
    id: number,
    description: string,
    createdAt: number | null,
    createdBy: {
        id: number,
        email: string,
        first_name: string,
        last_name: string,
        role: string,
        position: string,
        organization: string,
        organization_id: number,
    },
    question: number,
};
