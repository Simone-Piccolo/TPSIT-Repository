let sequence = [];
let userSequence = [];
let score = 0;
let gameActive = false;

// Riferimenti agli elementi HTML
const grid = document.getElementById('grid');
const startBtn = document.getElementById('startBtn');
const message = document.getElementById('message');
const scoreDisplay = document.getElementById('score');

// Impostazione della griglia dei pulsanti
function createGrid(rows = 4, cols = 4) {
  grid.innerHTML = ''; // Pulisce la griglia
  for (let i = 0; i < rows * cols; i++) {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-light', 'button-dim');
    button.dataset.index = i;  // Aggiungi l'indice per riferimento
    button.addEventListener('click', () => handleUserInput(i));
    grid.appendChild(button);
  }
}

// Avvio del gioco
startBtn.addEventListener('click', startGame);

function startGame() {
  gameActive = true;
  score = 0;
  sequence = [];
  userSequence = [];
  scoreDisplay.textContent = `Punteggio: ${score}`;
  message.textContent = "Memorizza la sequenza!";
  nextRound();
}

// Genera il prossimo turno
function nextRound() {
  userSequence = [];
  sequence.push(Math.floor(Math.random() * 16)); // Aggiunge un nuovo pulsante alla sequenza
  showSequence(sequence);
}

// Mostra la sequenza di pulsanti
function showSequence(seq) {
  let index = 0;
  const interval = setInterval(() => {
    const btn = grid.children[seq[index]];
    btn.classList.add('button-light');
    setTimeout(() => {
      btn.classList.remove('button-light');
    }, 500);
    index++;

    if (index === seq.length) {
      clearInterval(interval);
      enableUserInput(true);
    }
  }, 1000);
}

// Abilita o disabilita l'input dell'utente
function enableUserInput(enable) {
  const buttons = grid.children;
  for (let button of buttons) {
    button.disabled = !enable;
  }
}

// Gestisce l'input dell'utente
function handleUserInput(index) {
  if (!gameActive) return;

  userSequence.push(index);
  const correct = userSequence.length === sequence.length && 
                  userSequence.every((val, i) => val === sequence[i]);

  if (correct) {
    if (userSequence.length === sequence.length) {
      score++;
      scoreDisplay.textContent = `Punteggio: ${score}`;
      message.textContent = "Hai indovinato, prossimo turno!";
      setTimeout(nextRound, 1000);
    }
  } else {
    message.textContent = "Hai sbagliato! Gioco finito.";
    gameActive = false;
  }
}
