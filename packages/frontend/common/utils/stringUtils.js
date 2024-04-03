export default function majFirstName(firstName) {
    return firstName.replace(/^[a-z]|-[a-z]/g, (a) => {
        return a.toUpperCase();
    });
}
