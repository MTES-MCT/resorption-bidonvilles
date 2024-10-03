export default function columnToNumber(column: string): number {
    let number = 0;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const base = alphabet.length;
    for (let i = 0; i < column.length; i += 1) {
        number = number * base + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(column.charAt(i).toUpperCase()) + 1;
    }
    return number;
}
