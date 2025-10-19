// 1️⃣ Cambia Messaggio
const messaggio = document.getElementById('messaggio');
const btnMessaggio = document.getElementById('btnMessaggio');
btnMessaggio.addEventListener('click', () => {
  messaggio.textContent = 'Hai cliccato il bottone!';
});

// 2️⃣ Accendi/Spegni
let luceAccesa = false;
const statoLuce = document.getElementById('statoLuce');
const btnLuce = document.getElementById('btnLuce');
btnLuce.addEventListener('click', () => {
  luceAccesa = !luceAccesa;
  statoLuce.textContent = luceAccesa ? 'La luce è accesa 💡' : 'La luce è spenta ⚫';
});

// 3️⃣ Convertitore di Unità
const inputKg = document.getElementById('inputKg');
const risultatoConversione = document.getElementById('risultatoConversione');
inputKg.addEventListener('input', () => {
  const kg = parseFloat(inputKg.value) || 0;
  const g = kg * 1000;
  risultatoConversione.textContent = `${kg} kg = ${g} g`;
});

// 4️⃣ Form di Registrazione
const form = document.getElementById('formRegistrazione');
const riepilogo = document.getElementById('riepilogo');

form.addEventListener('input', () => {
  const nome = document.getElementById('nome').value;
  const genere = form.querySelector('input[name="genere"]:checked')?.value || '';
  const paese = document.getElementById('paese').value;

  riepilogo.textContent = `
    Nome: ${nome || '-'} | Genere: ${genere || '-'} | Paese: ${paese || '-'}
  `;
});
