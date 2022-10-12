module.exports = planShantytown => ({
    plan_id: planShantytown.plan_id,
    shantytown_id: planShantytown.shantytown_id,
    name: planShantytown.plan_name,
    topics: planShantytown.topics,
    category: planShantytown.plan_category,
    operator: {
        name: planShantytown.org_name,
        abbreviation: planShantytown.org_abbreviation,
        id: planShantytown.org_id,
    },
});
