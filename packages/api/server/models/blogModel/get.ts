import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { Blog } from '#root/types/resources/Blog.d';

export default async function get(): Promise<Blog[]> {
    const rows: Blog[] = await sequelize.query(
        `SELECT
            *
        FROM 
            blog_params`,
        {
            type: QueryTypes.SELECT,
        },
    );
    return rows;
}
