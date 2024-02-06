import { Role } from '#root/types/resources/Role.d';

export default (role: Role): Role => ({
    id: role.id,
    name: role.name,
});
