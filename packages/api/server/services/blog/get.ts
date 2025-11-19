import ServiceError from '#server/errors/ServiceError';
import blogModel from '#server/models/blogModel';
import { Blog } from '#root/types/resources/Blog.d';

const isBadgeActive = (blogRecord: Blog[]): boolean => {
    const currentDate: Date = new Date();
    let activeBadgePeriod: boolean = false;
    if (currentDate >= new Date(blogRecord[0].from_date) && currentDate <= new Date(blogRecord[0].to_date)) {
        activeBadgePeriod = true;
    }

    return activeBadgePeriod;
};

export default async (): Promise<Blog> => {
    let blogRecord: Blog[];
    try {
        blogRecord = await blogModel.get();
        console.log('BlogRecord non traité:', blogRecord);
    } catch (error) {
        throw new ServiceError('bade_fetch_failed', error);
    }

    if (!blogRecord || blogRecord.length === 0) {
        // throw new ServiceError('badge_not_found', 'Aucun paramètre de badge trouvé en base de données' as any);
        blogRecord.push({ from_date: null, to_date: null, isBadgeActive: false });
        console.log('EMPTY isBadgeActive', blogRecord[0]);
    } else {
        console.log('isBadgeActive', blogRecord[0]);
        blogRecord[0].isBadgeActive = isBadgeActive(blogRecord);
    }
    console.log('BlogRecord:', blogRecord[0]);

    return blogRecord[0];
};
