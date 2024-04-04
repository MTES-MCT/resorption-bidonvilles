export default function majFirstName(firstName) {
    return firstName.toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase());
};
