export default function (user) {
    const now = Date.now();
    return (
        ["new", "inactive"].includes(user.status) &&
        user.user_accesses.length > 0 &&
        now - user.user_accesses[0].expires_at * 1000 > 0
    );
}
