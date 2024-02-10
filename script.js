document.addEventListener('DOMContentLoaded', () => {
    const scrambleButton = document.getElementById('newScramble');
    scrambleButton.addEventListener('click', generateScramble);

    let scramble = getScrambleFromCookie();
    if (!scramble) {
        scramble = generateRandomScramble();
        setScrambleToCookie(scramble);
    }
    displayScramble(scramble);
});

function generateScramble() {
    const scramble = generateRandomScramble();
    setScrambleToCookie(scramble);
    displayScramble(scramble);
}

function generateRandomScramble() {
    const moves = ['R', 'L', 'U', 'D', 'F', 'B'];
    const modifiers = ['', '\'', '2'];
    let scramble = [];
    let lastMove = '';
    let secondLastMove = '';

    // Define adjacent faces to ensure a face is moved only after an adjacent face has moved
    const adjacentFaces = {
        'R': ['U', 'D', 'F', 'B'],
        'L': ['U', 'D', 'F', 'B'],
        'U': ['R', 'L', 'F', 'B'],
        'D': ['R', 'L', 'F', 'B'],
        'F': ['U', 'D', 'R', 'L'],
        'B': ['U', 'D', 'R', 'L']
    };

    while (scramble.length < 25) {
        let move = moves[Math.floor(Math.random() * moves.length)];
        // Ensure the current move is on a different face than the last move
        if (move === lastMove) {
            continue; // Skip this iteration if the move is the same as the last move
        }
        const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
        // Check if move is not the same as the last move and the second last move is adjacent to the current move
        if (move !== lastMove && (move !== secondLastMove || adjacentFaces[move].includes(lastMove))) {
            scramble.push(move + modifier);
            secondLastMove = lastMove;  // Update the second last move
            lastMove = move;            // Update the last move
        }
    }
    return scramble;
}

function displayScramble(scramble) {
    const grid = document.getElementById('scrambleGrid');
    grid.innerHTML = ''; // Clear the grid first
    // Map each move to a specific color based on the standard Rubik's Cube orientation
    const colorMap = {
        'R': 'orange',
        'L': 'red',
        'U': 'yellow',
        'D': 'white',
        'F': 'green',
        'B': 'blue'
    };

    scramble.forEach(move => {
        const cell = document.createElement('div');
        cell.textContent = move;
        // Extract the face involved in the move to determine the cell's background color
        const moveFace = move.charAt(0);
        cell.style.backgroundColor = colorMap[moveFace];
        // Set the text color for maximum legibility
        cell.style.color = ['R', 'B', 'F'].includes(moveFace) ? 'white' : 'black'; // White text for red, blue, green backgrounds; black otherwise
        grid.appendChild(cell);
    });
}



function setScrambleToCookie(scramble) {
    const inOneHour = new Date(new Date().getTime() + 60 * 60 * 1000).toUTCString();
    document.cookie = `scramble=${scramble.join(',')}; expires=${inOneHour}; path=/`;
}

function getScrambleFromCookie() {
    const cookies = document.cookie.split('; ');
    const scrambleCookie = cookies.find(row => row.startsWith('scramble='));
    return scrambleCookie ? scrambleCookie.split('=')[1].split(',') : null;
}
