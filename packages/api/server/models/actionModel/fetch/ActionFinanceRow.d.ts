type ActionFinanceRow = {
    action_id: number,
    year: number,
    amount: number,
    real_amount: number | null,
    comments: string,
    action_finance_type_uid: string,
    action_finance_type_name: string
};

export default ActionFinanceRow;
