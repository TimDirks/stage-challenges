import fs from 'fs';

// Read the text file and store it in a variable.
const mazeTemplate = fs.readFileSync('7/input.txt', 'utf8');

// Convert the string maze into a 2D array.
const mazeArray = mazeTemplate
    .trim()
    .split('\n')
    .map((line) => line.split(''));

/**
 * Get the wall and empty symbol from the text.
 * With this setup, we can freely switch between the normal and binary maze file and the solution should still work.
 */
// In a well-designed maze, the corner can't ever be a maze entry point.
const mazeWallSymbol = mazeArray[0][0];
// It's a given that the start is at the top of the maze so finding the first non-wall symbol in the top row is the empty symbol.
const mazeEmptySymbol = mazeArray[0].find((symbol) => symbol !== mazeWallSymbol);

// Get the basic maze variables.
const mazeHeight = mazeArray.length;
const mazeWidth = mazeArray[0].length;
const mazeStart = [mazeArray[0].indexOf(mazeEmptySymbol), 0];
const mazeEnd = [mazeArray[mazeHeight - 1].indexOf(mazeEmptySymbol), mazeHeight - 1];

// Basic helper function to get all existing neighbouring cells that are free.
const getFreeNeighbouringCells = (maze, cell) => {
    const [cellX, cellY] = cell;
    const neighbouringCells = [];

    [
        [cellX - 1, cellY],
        [cellX + 1, cellY],
        [cellX, cellY - 1],
        [cellX, cellY + 1],
    ].forEach(([neighbourX, neighbourY]) => {
        if (
            maze[neighbourY]
            && maze[neighbourY][neighbourX]
            && maze[neighbourY][neighbourX] === mazeEmptySymbol
        ) {
            neighbouringCells.push([neighbourX, neighbourY]);
        }
    });

    return neighbouringCells;
}

// To find the maze solution, we're going to implement Dijkstra's Shortest Path algorithm.
// For more info about that algorithm, see https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
const fillMazeWithSteps = (maze, mazeStartPos) => {
    maze[mazeStartPos[1]][mazeStartPos[0]] = 0;

    const cellQueue = [mazeStartPos];

    while (cellQueue.length) {
        const cell = cellQueue.shift();
        const cellStep = maze[cell[1]][cell[0]];

        const neighbouringCells = getFreeNeighbouringCells(maze, cell);

        neighbouringCells.forEach(([neighbourX, neighbourY]) => {
            maze[neighbourY][neighbourX] = cellStep + 1;

            cellQueue.push([neighbourX, neighbourY]);
        })
    }

    return maze;
}

// Make a copy of the maze array to prevent the original from being altered.
const filledMazeArray = fillMazeWithSteps([...mazeArray], mazeStart);

console.log(filledMazeArray);
