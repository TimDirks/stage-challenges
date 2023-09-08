const mazeFileInput = document.getElementById('input-maze-file');
const mazeSolveButton = document.getElementById('button-solve-maze');
const stepSolveButton = document.getElementById('button-solve-step');
const mazeCanvas = document.getElementById('maze');
const mazeCanvasContext = mazeCanvas.getContext('2d');

const mazeCanvasCellSize = 20;
const bushImg = new Image;
const characterImg = new Image;

bushImg.src = 'assets/bush.png';
characterImg.src = 'assets/character.png';

let mazeArray = [];
let solvedMazeArray = [];

const mazeSolveSteps = {};
let mazeSolveStep = -1;
let maxMazeSolveSteps = -1;

const clearCanvas = () => {
    mazeCanvasContext.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
}

const drawMaze = (maze) => {
    clearCanvas();

    const mazeHeight = maze.length;
    const mazeWidth = maze[0].length;

    mazeCanvas.width = mazeWidth * mazeCanvasCellSize;
    mazeCanvas.height = mazeHeight * mazeCanvasCellSize;

    maze.forEach((row, yPos) => {
        row.forEach((col, xPos) => {
            switch (col) {
                case '*':
                    drawMazeImg(xPos, yPos, bushImg);
                    break;
                case ' ':
                    drawMazeSquare(xPos, yPos, 'sandybrown');
                    break;
                default:
                    drawMazeSquare(xPos, yPos, 'yellow');
                    break;
            }
        });
    });
}

const drawMazeImg = (xPos, yPos, img) => {
    mazeCanvasContext.drawImage(
        img,
        xPos * mazeCanvasCellSize,
        yPos * mazeCanvasCellSize,
        mazeCanvasCellSize,
        mazeCanvasCellSize,
    );
}

const drawMazeSquare = (xPos, yPos, color) => {
    mazeCanvasContext.fillStyle = color;

    mazeCanvasContext.fillRect(
        xPos * mazeCanvasCellSize,
        yPos * mazeCanvasCellSize,
        mazeCanvasCellSize,
        mazeCanvasCellSize,
    );
}

const loadMazeFromFile = (fileReaderEvent) => {
    const mazeTemplate = fileReaderEvent.target.result;

    mazeArray = mazeTemplate
        .trim()
        .split('\n')
        .map((line) => line.split(''));

    drawMaze(mazeArray);
}

const readMazeFile = (file) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file, 'UTF-8');

    fileReader.onload = loadMazeFromFile;
    fileReader.onerror = () => {
        alert('Something went wrong reading the maze file!');
    }
}

const handleMazeFileUpload = (event) => {
    if (!event.target
        || !event.target.files
        || !event.target.files.length
    ) {
        return;
    }

    const mazeFile = event.target.files[0];

    readMazeFile(mazeFile);
}

const solveMaze = () => {
    // Make a copy of the maze array to prevent the original from being altered.
    const filledMazeArray = fillMazeWithSteps(copyMultiArray(mazeArray));

    // Follow the quickest path from start to finish and mark it with the path symbol.
    solvedMazeArray = mapMazeSolution(copyMultiArray(mazeArray), filledMazeArray);
}

const stepMaze = () => {
    if (mazeSolveStep > maxMazeSolveSteps) {
        return;
    }

    if (mazeSolveStep >= 0) {
        const [curX, curY] = mazeSolveSteps[mazeSolveStep];

        drawMazeSquare(curX, curY, 'yellow');
    }

    mazeSolveStep++;

    if (mazeSolveStep > maxMazeSolveSteps) {
        return;
    }

    const [nextX, nextY] = mazeSolveSteps[mazeSolveStep];

    drawMazeImg(nextX, nextY, characterImg);
}

clearCanvas();

mazeFileInput.addEventListener('change', handleMazeFileUpload)
mazeSolveButton.addEventListener('click', solveMaze);
stepSolveButton.addEventListener('click', stepMaze);

// ---- The code below is pretty much the same as the 'solution.mjs' logic ----
// I have duplicated this code to keep the both files focused on one mode of reading and displaying the solution.

const mazeWallSymbol = '*';
const mazeEmptySymbol = ' ';

// Basic helper function to copy a 2 dimensional array without references.
const copyMultiArray = (arr) => {
    return arr.map((row) => row.slice());
}

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
    const mazeStart = [maze[0].indexOf(mazeEmptySymbol), 0];

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
    let currentPathCell = [maze[maze.length - 1].indexOf(mazeEmptySymbol), maze.length - 1];
    console.log(currentPathCell);
    let pathLength = filledMaze[currentPathCell[1]][currentPathCell[0]]

    // Mark the maze exit with the path symbol.
    maze[currentPathCell[1]][currentPathCell[0]] = pathLength;

    mazeSolveSteps[pathLength] = currentPathCell;
    maxMazeSolveSteps = pathLength;

    while (pathLength) {
        const neighbouringCells = getOpenNeighbouringCells(filledMaze, currentPathCell);

        neighbouringCells.forEach(([neighbourX, neighbourY]) => {
            // If the neighbouring cell isn't the previous step, skip it.
            if (filledMaze[neighbourY][neighbourX] !== pathLength - 1) {
                return;
            }

            // Otherwise set the cell as the new current path and mark the location with the path symbol.
            currentPathCell = [neighbourX, neighbourY];

            maze[currentPathCell[1]][currentPathCell[0]] = pathLength;

            pathLength--;
            mazeSolveSteps[pathLength] = currentPathCell;
        });
    }

    return maze;
}
