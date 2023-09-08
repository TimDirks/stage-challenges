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
// The symbol that will be used to mark the solution path.
const mazePathSymbol = '#';

// Get the basic maze variables.
const mazeHeight = mazeArray.length;
const mazeWidth = mazeArray[0].length;
const mazeStart = [mazeArray[0].indexOf(mazeEmptySymbol), 0];
const mazeEnd = [mazeArray[mazeHeight - 1].indexOf(mazeEmptySymbol), mazeHeight - 1];

// Basic helper function to get all existing neighbouring cells that aren't walls.
const getOpenNeighbouringCells = (maze, cell) => {
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
            && maze[neighbourY][neighbourX] != null
            && maze[neighbourY][neighbourX] !== mazeWallSymbol
        ) {
            neighbouringCells.push([neighbourX, neighbourY]);
        }
    });

    return neighbouringCells;
}

// To find the maze solution, we're going to implement Dijkstra's Shortest Path algorithm.
// For more info about that algorithm, see https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
const fillMazeWithSteps = (maze) => {
    maze[mazeStart[1]][mazeStart[0]] = 0;

    const cellQueue = [mazeStart];

    while (cellQueue.length) {
        const cell = cellQueue.shift();
        const cellStep = maze[cell[1]][cell[0]];

        const neighbouringCells = getOpenNeighbouringCells(maze, cell);

        neighbouringCells.forEach(([neighbourX, neighbourY]) => {
            // If the neighbouring cell isn't empty, don't overwrite its step count.
            if (maze[neighbourY][neighbourX] !== mazeEmptySymbol) {
                return;
            }

            maze[neighbourY][neighbourX] = cellStep + 1;

            cellQueue.push([neighbourX, neighbourY]);
        })
    }

    return maze;
}

// Loop over the shortest path in the filled maze and mark the corresponding cells in the original
// maze with the path symbol.
const mapMazeSolution = (maze, filledMaze) => {
    let currentPathCell = mazeEnd;
    let pathLength = filledMaze[currentPathCell[1]][currentPathCell[0]]

    while (pathLength) {
        maze[currentPathCell[1]][currentPathCell[0]] = mazePathSymbol;

        const neighbouringCells = getOpenNeighbouringCells(filledMaze, currentPathCell);

        neighbouringCells.forEach(([neighbourX, neighbourY]) => {
            // If the neighbouring cell isn't the previous step, skip it.
            if (filledMaze[neighbourY][neighbourX] !== pathLength - 1) {
                return;
            }

            currentPathCell = [neighbourX, neighbourY];

            pathLength--;
        });
    }

    return maze;
}

// Make a copy of the maze array to prevent the original from being altered.
const filledMazeArray = fillMazeWithSteps([...mazeArray]);

// Follow the quickest path from start to finish and mark it with the path symbol.
const mappedMazeArray = mapMazeSolution([...mazeArray], filledMazeArray);

console.log(mappedMazeArray.map(l => l.join``).join`\n`);
