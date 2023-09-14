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

// Create a dictionary to test the function.
const testData = [
    {
        value: 1,
        expectedOutcome: 'I',
    },
    {
        value: 14,
        expectedOutcome: 'XIV',
    },
    {
        value: 159,
        expectedOutcome: 'CLIX',
    },
    {
        value: 296,
        expectedOutcome: 'CCXCVI',
    },
    {
        value: 789,
        expectedOutcome: 'DCCLXXXIX',
    },
    {
        value: 3888,
        expectedOutcome: 'MMMDCCCLXXXVIII',
    },
    {
        value: 3992,
        expectedOutcome: 'MMMCMXCII',
    },
];

// Test all the cases to see if the function works.
testData.forEach(({value, expectedOutcome}) => {
    const functionOutcome = numberToRoman(value);
    const outcomesMatch = expectedOutcome === functionOutcome;

    console.log(`The Roman Numeral for ${value} is ${expectedOutcome}. The function returned ${functionOutcome} which is ${outcomesMatch ? 'correct' : 'incorrect'}!`);
});
