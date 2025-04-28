document.addEventListener('DOMContentLoaded', () => {
    console.log("Guess the Football Player game initialized");

    const players = [
        { name: "Lionel Messi", clues: ["Argentinian", "Played for Barcelona", "7-time Ballon d'Or winner"] },
        { name: "Cristiano Ronaldo", clues: ["Portuguese", "Played for Manchester United", "Record goalscorer"] },
        { name: "Kylian Mbappé", clues: ["French", "Plays for PSG", "World Cup winner at 19"] },
        { name: "Erling Haaland", clues: ["Norwegian", "Plays for Manchester City", "Goal machine"] },
        { name: "Neymar Jr", clues: ["Brazilian", "Known for skills and flair", "Played for Barcelona and PSG"] },
        { name: "Kevin De Bruyne", clues: ["Belgian", "Master playmaker", "Plays for Manchester City"] },
        { name: "Mohamed Salah", clues: ["Egyptian", "Plays for Liverpool", "Premier League Golden Boot winner"] },
        { name: "Harry Kane", clues: ["English", "Plays for Bayern Munich", "Top scorer for England national team"] },
        { name: "Robert Lewandowski", clues: ["Polish", "Prolific striker", "Played for Bayern Munich and Barcelona"] },
        { name: "Karim Benzema", clues: ["French", "Won Ballon d'Or", "Longtime Real Madrid striker"] },
        { name: "Vinicius Jr", clues: ["Brazilian", "Young star for Real Madrid", "Lightning fast winger"] },
        { name: "Luka Modric", clues: ["Croatian", "Midfield maestro", "Won Ballon d'Or in 2018"] },
        { name: "Virgil van Dijk", clues: ["Dutch", "Towering defender", "Plays for Liverpool"] },
        { name: "Sadio Mane", clues: ["Senegalese", "Speedy winger", "Former Liverpool player"] },
        { name: "Pedri", clues: ["Spanish", "Young talent", "Plays for Barcelona"] },
        { name: "Jude Bellingham", clues: ["English", "Midfield wonderkid", "Plays for Real Madrid"] },
        { name: "Antoine Griezmann", clues: ["French", "Stylish forward", "Plays for Atlético Madrid"] },
        { name: "Heung-min Son", clues: ["South Korean", "Tottenham Hotspur star", "Known for both-footed finishing"] },
        { name: "Bruno Fernandes", clues: ["Portuguese", "Creative midfielder", "Plays for Manchester United"] },
        { name: "Gavi", clues: ["Spanish", "Teen sensation", "Plays for Barcelona"] }
    ];

    let selectedPlayer;
    let clueIndex = 0;

    const clueDisplay = document.getElementById('clue');
    const guessInput = document.getElementById('guess-input');
    const submitButton = document.getElementById('submit-guess');
    const resultDisplay = document.getElementById('result');
    const nextButton = document.getElementById('next-player');

    function startNewGame() {
        selectedPlayer = players[Math.floor(Math.random() * players.length)];
        clueIndex = 0;
        clueDisplay.textContent = `Clue: ${selectedPlayer.clues[clueIndex]}`;
        resultDisplay.textContent = "";
        guessInput.value = "";
        guessInput.disabled = false;
        submitButton.disabled = false;
        nextButton.style.display = "none";
        console.log(`[Game] Selected player: ${selectedPlayer.name}`);
    }

    function submitGuess() {
        const userGuess = guessInput.value.trim().toLowerCase();
        const correctName = selectedPlayer.name.toLowerCase();

        if (userGuess === correctName) {
            resultDisplay.textContent = "🎉 Correct! It was " + selectedPlayer.name + "!";
            guessInput.disabled = true;
            submitButton.disabled = true;
            nextButton.style.display = "inline-block";
        } else {
            clueIndex++;
            if (clueIndex < selectedPlayer.clues.length) {
                clueDisplay.textContent = `Clue: ${selectedPlayer.clues[clueIndex]}`;
                resultDisplay.textContent = "❌ Try again!";
            } else {
                resultDisplay.textContent = `❌ No more clues! The correct answer was ${selectedPlayer.name}.`;
                guessInput.disabled = true;
                submitButton.disabled = true;
                nextButton.style.display = "inline-block";
            }
        }
    }

    submitButton.addEventListener('click', submitGuess);
    nextButton.addEventListener('click', startNewGame);

    startNewGame();
});

