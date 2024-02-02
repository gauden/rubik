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

    while (scramble.length < 25) {
        let move = moves[Math.floor(Math.random() * moves.length)];
        // Ensure the current move is on a different face than the last move
        if (move === lastMove) {
            continue; // Skip this iteration if the move is the same as the last move
        }
        const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
        scramble.push(move + modifier);
        lastMove = move; // Update the lastMove for the next iteration
    }
    return scramble;
}

function displayScramble(scramble) {
    const grid = document.getElementById('scrambleGrid');
    grid.innerHTML = ''; // Clear the grid first
    // Map each move to a specific color based on the standard Rubik's Cube orientation
    const colorMap = {
        'R': 'red',
        'L': 'orange',
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
