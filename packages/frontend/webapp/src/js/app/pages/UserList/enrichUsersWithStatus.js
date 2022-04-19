export default function enrichUsersWithStatus(users) {
    return users.map(user => ({
        ...user,
        full_name: `${user.first_name} ${user.last_name}`,
        user_status: getUserStatus(user),
        territory:
            user.organization.location.type === "nation"
                ? "National"
                : user.organization.location[user.organization.location.type]
                      .name
    }));
}

function getUserStatus(user) {
    if (user.user_accesses.length > 0 && user.user_accesses[0].used_at) {
        return {
            type: "activated",
            text: "Activé",
            date: user.user_accesses[0].used_at,
            icon: "user-check",
            color: "text-tertiary"
        };
    }

    if (isExpired(user)) {
        return {
            type: "expired",
            text: "Expiré",
            date: user.user_accesses[0].expires_at,
            icon: "unlink",
            color: "text-G600"
        };
    }

    if (user.user_accesses.length > 0 && user.user_accesses[0].created_at) {
        return {
            type: "sent",
            text: "Envoyé",
            date: user.user_accesses[0].created_at,
            icon: "paper-plane",
            color: "text-primary"
        };
    }

    return {
        type: "requested",
        text: "Demandé",
        date: user.created_at,
        icon: "flag",
        color: "text-secondary"
    };
}

function isExpired(user) {
    const now = Date.now();
    return (
        user !== null &&
        user.status !== "active" &&
        user.user_accesses.length > 0 &&
        now - user.user_accesses[0].expires_at * 1000 > 0
    );
}
