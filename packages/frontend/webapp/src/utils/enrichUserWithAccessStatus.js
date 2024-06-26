const statuses = {
    active(user) {
        return { status: "activated", date: user.user_accesses[0]?.used_at };
    },
    inactive() {
        return { status: "deactivated" };
    },
    refused(user) {
        return { status: "refused", date: user.user_accesses[0]?.refused_at };
    },
    new(user) {
        const lastAccess = user.user_accesses[0] || null;
        if (lastAccess === null) {
            return { status: "requested", date: user.created_at };
        }

        if (Date.now() - lastAccess.expires_at * 1000 > 0) {
            return { status: "expired", date: lastAccess.expires_at };
        }

        return { status: "sent", date: lastAccess.created_at };
    },
};

export default function (user) {
    const { status, date } = statuses[user.status](user);
    user.access_status = {
        status,
        date,
    };
    return user;
}
