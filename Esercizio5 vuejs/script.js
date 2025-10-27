// --- 1. Stato del Messaggio ---
const messaggio = document.getElementById("messaggio");
const btnSuccesso = document.getElementById("btnSuccesso");
const btnErrore = document.getElementById("btnErrore");
const btnReset = document.getElementById("btnReset");

btnSuccesso.onclick = () => {
messaggio.className = "box success";
};

btnErrore.onclick = () => {
messaggio.className = "box error";
};

btnReset.onclick = () => {
messaggio.className = "box";
};

// --- 2. Avatar Personalizzabile ---
const w = document.getElementById("w");
const h = document.getElementById("h");
const colore = document.getElementById("colore");
const avatar = document.getElementById("avatar");

function aggiornaAvatar() {
avatar.style.width = w.value + "px";
avatar.style.height = h.value + "px";
avatar.style.background = colore.value;
}

w.oninput = aggiornaAvatar;
h.oninput = aggiornaAvatar;
colore.oninput = aggiornaAvatar;