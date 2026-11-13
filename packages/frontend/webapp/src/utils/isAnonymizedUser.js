export default function isAnonymizedUser(user) {
    return user.first_name === "Utilisateur" && user.last_name === "Désactivé";
}
