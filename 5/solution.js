// To convert a number to roman numerals I'll be using a dictionary table which can be looped over.
const romanMatrix = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
];

// Function to convert any given number to a roman numeral.
const numberToRoman = (number) => {
    // Create an empty string to build the roman numeral letter by letter.
    let roman = '';
    // Create a copy of the passed number as to not edit the parameter.
    let numberCopy = number;

    // Loop over the roman matrix.
    romanMatrix.forEach(([value, key]) => {
        // Add the key as many times as possible.
        // The repeat function automatically floors the given count, so we don't have to handle that.
        roman += key.repeat(numberCopy / value);

        // Modulo the passed number by the value as many times as possible.
        numberCopy %= value;
    });

    return roman;
}

console.log(numberToRoman(3992));
