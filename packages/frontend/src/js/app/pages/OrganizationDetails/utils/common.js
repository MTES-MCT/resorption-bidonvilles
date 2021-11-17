function formatDate(d) {
    let theDate = new Date(d);
    const year = theDate.getFullYear();
    const month = `${theDate.getMonth() + 1}`.padStart(2, "0");
    const day = `${theDate.getDate()}`.padStart(2, "0");

    return `${day}/${month}/${year}`;
}

function isCurrentUserNationalAdmin(role_id) {
    return role_id === "national_admin" ? true : false;
}

export { isCurrentUserNationalAdmin, formatDate };
