// guessthefootballplayer.js
document.addEventListener('DOMContentLoaded', function() {
    const clueElement = document.getElementById('clue');
    const guessInput = document.getElementById('guess-input');
    const submitGuess = document.getElementById('submit-guess');
    const getClue = document.getElementById('get-clue');
    const gameStatus = document.getElementById('game-status');
    const nextPlayer = document.getElementById('next-player');
    const resetGame = document.getElementById('reset-game');

    const players = [
        {
            name: "Lionel Messi",
            clues: [
                "This player has won the Ballon d'Or multiple times.",
                "He played for Barcelona before moving to PSG.",
                "Known for his incredible dribbling skills."
            ]
        },
        {
            name: "Cristiano Ronaldo",
            clues: [
                "This player has scored over 800 career goals.",
                "He has played for Real Madrid and Juventus.",
                "Famous for his powerful free kicks."
            ]
        },
        {
            name: "Neymar Jr.",
            clues: [
                "This player is known for his flair and tricks on the field.",
                "He transferred from Barcelona to PSG for a world-record fee.",
                "He won the Olympic gold medal in 2016 with Brazil."
            ]
        },
        {
            name: "Kylian Mbappe",
            clues: [
                "This young star led France to the 2018 World Cup title.",
                "He plays for PSG and is known for his speed.",
                "He was born in 1998 and became a global icon early."
            ]
        },
        {
            name: "Kevin De Bruyne",
            clues: [
                "This midfielder is known for his precise passes.",
                "He plays for Manchester City and Belgium.",
                "He has won multiple Premier League titles."
            ]
        },
        {
            name: "Robert Lewandowski",
            clues: [
                "This striker is a top scorer for Bayern Munich.",
                "He hails from Poland and is known for his finishing.",
                "He won the 2020 Champions League with Bayern."
            ]
        },
        {
            name: "Sergio Ramos",
            clues: [
                "This defender is famous for his leadership at Real Madrid.",
                "He has won multiple Champions League titles.",
                "Known for his dramatic last-minute goals."
            ]
        },
        {
            name: "Virgil van Dijk",
            clues: [
                "This Dutch defender is a key player for Liverpool.",
                "He was named the best defender in the world in 2019.",
                "He helped win the 2019 Champions League."
            ]
        },
        {
            name: "Mohamed Salah",
            clues: [
                "This Egyptian winger shines for Liverpool.",
                "He is known for his goal-scoring consistency.",
                "He won the Premier League in the 2019-20 season."
            ]
        },
        {
            name: "Harry Kane",
            clues: [
                "This English striker captains Tottenham Hotspur.",
                "He is the all-time leading scorer for England.",
                "Known for his penalty-taking skills."
            ]
        },
        {
            name: "Karim Benzema",
            clues: [
                "This French striker won the 2022 Ballon d'Or.",
                "He spent most of his career at Real Madrid.",
                "Known for his teamwork with Ronaldo."
            ]
        },
        {
            name: "Erling Haaland",
            clues: [
                "This Norwegian striker joined Manchester City in 2022.",
                "He broke goal-scoring records in his debut season.",
                "Known for his towering height and power."
            ]
        },
        {
            name: "Luka Modric",
            clues: [
                "This Croatian midfielder won the 2018 Ballon d'Or.",
                "He plays for Real Madrid and is known for his vision.",
                "He led Croatia to the 2018 World Cup final."
            ]
        },
        {
            name: "Sadio Mane",
            clues: [
                "This Senegalese winger played for Liverpool.",
                "He won the Champions League in 2019.",
                "Known for his pace and work rate."
            ]
        },
        {
            name: "Kylian Mbappe",
            clues: [
                "This French forward is a rising star at PSG.",
                "He scored in the 2022 World Cup final.",
                "Known for his lightning-fast runs."
            ]
        },
        {
            name: "Paul Pogba",
            clues: [
                "This French midfielder plays for Juventus.",
                "He won the 2018 World Cup with France.",
                "Known for his long-range shots."
            ]
        },
        {
            name: "David Beckham",
            clues: [
                "This English player was famous for his free kicks.",
                "He played for Manchester United and Real Madrid.",
                "He won the MLS Cup with LA Galaxy."
            ]
        },
        {
            name: "Zinedine Zidane",
            clues: [
                "This French legend won the 1998 World Cup.",
                "He coached Real Madrid to three Champions League titles.",
                "Known for his elegant playing style."
            ]
        },
        {
            name: "Ronaldinho",
            clues: [
                "This Brazilian won the Ballon d'Or in 2005.",
                "He played for Barcelona and AC Milan.",
                "Known for his joyful and creative play."
            ]
        },
        {
            name: "Thierry Henry",
            clues: [
                "This French striker was a star at Arsenal.",
                "He won the Premier League Golden Boot multiple times.",
                "Known for his pace and finishing."
            ]
        }
    ];

    let currentPlayerIndex = 0;
    let currentClueIndex = 0;

    function updateClue() {
        if (currentClueIndex < players[currentPlayerIndex].clues.length) {
            clueElement.textContent = players[currentPlayerIndex].clues[currentClueIndex];
            currentClueIndex++;
        } else {
            clueElement.textContent = "No more clues available!";
        }
    }

    getClue.addEventListener('click', function() {
        updateClue();
    });

    submitGuess.addEventListener('click', function() {
        const guess = guessInput.value.trim().toLowerCase();
        const correctName = players[currentPlayerIndex].name.toLowerCase();

        if (guess === correctName) {
            gameStatus.textContent = "Correct! Moving to the next player...";
            currentClueIndex = 0; 
            setTimeout(() => {
                currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
                clueElement.textContent = players[currentPlayerIndex].clues[0];
                gameStatus.textContent = "Start the game to guess!";
                guessInput.value = "";
                currentClueIndex = 1; 
            }, 1000);
        } else {
            gameStatus.textContent = "Wrong guess! Try again.";
        }
    });

    nextPlayer.addEventListener('click', function() {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        currentClueIndex = 0;
        clueElement.textContent = players[currentPlayerIndex].clues[0];
        gameStatus.textContent = "Start the game to guess!";
        guessInput.value = "";
    });

    resetGame.addEventListener('click', function() {
        currentPlayerIndex = 0;
        currentClueIndex = 0;
        clueElement.textContent = players[currentPlayerIndex].clues[0];
        gameStatus.textContent = "Start the game to guess!";
        guessInput.value = "";
    });

    updateClue();
});