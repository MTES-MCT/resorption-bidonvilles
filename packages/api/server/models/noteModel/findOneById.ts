import findByIds from './findByIds';

export default async (id: string) => {
    const result = await findByIds([id]);
    return result.length === 1 ? result[0] : null;
};
