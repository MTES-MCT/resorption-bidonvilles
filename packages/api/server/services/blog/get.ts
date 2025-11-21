import ServiceError from '#server/errors/ServiceError';
import blogModel from '#server/models/blogModel';
import { Blog } from '#root/types/resources/Blog.d';

const toLocalDate = (value?: string | Date | null): Date | null => {
    const date = new Date(value || Date.now());
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const isBadgeActive = (blogRecord: Blog[]): boolean => {
    const currentDate: Date = toLocalDate();
    let activeBadgePeriod: boolean = false;
    if (currentDate >= toLocalDate(blogRecord[0].from_date) && currentDate <= toLocalDate(blogRecord[0].to_date)) {
        activeBadgePeriod = true;
    }

    return activeBadgePeriod;
};

export default async (): Promise<Blog> => {
    let blogRecord: Blog[];
    try {
        blogRecord = await blogModel.get();
    } catch (error) {
        throw new ServiceError('badge_fetch_failed', error);
    }

    if (!blogRecord || blogRecord.length === 0) {
        blogRecord.push({ from_date: null, to_date: null, isBadgeActive: false });
    } else {
        blogRecord[0].isBadgeActive = isBadgeActive(blogRecord);
    }

    return blogRecord[0];
};
