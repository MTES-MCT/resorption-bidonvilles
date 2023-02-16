type ActionUserRow = {
    action_id: number,
    id: number | null,
    email: string,
    first_name: string | null,
    last_name: string | null,
    position: string,
    phone: string | null,
    admin_role_name: string | null,
    regular_role_name: string,
    organization_id: number | null,
    organization_name: string | null,
    organization_abbreviation: string | null,
};

export default ActionUserRow;
