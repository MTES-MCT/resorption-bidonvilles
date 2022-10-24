export default function (user) {
    const now = Date.now();
    return (
        user.status === "new" &&
        user.user_accesses.length > 0 &&
        now - user.user_accesses[0].expires_at * 1000 > 0
    );
}
