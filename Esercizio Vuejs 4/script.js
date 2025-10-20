const { createApp, ref, computed, watch } = Vue;

createApp({
setup() {
// Controllo Maggiore Età
const eta = ref(0);
const messaggioEta = computed(() =>
eta.value >= 18 ? "Maggiorenne" : "Minorenne"
);

// Carrello Semplice
const carrello = ref([
{ nome: "Mela", prezzo: 1.2 },
{ nome: "Pane", prezzo: 2.0 },
{ nome: "Latte", prezzo: 1.5 }
]);
const totaleCarrello = computed(() =>
carrello.value.reduce((tot, prod) => tot + prod.prezzo, 0)
);

//  Validazione Input Username
const username = ref("");
const erroreUsername = ref("");
watch(username, (nuovoValore) => {
if (nuovoValore.length > 0 && nuovoValore.length < 5) {
erroreUsername.value = "L'username deve avere almeno 5 caratteri.";
} else {
erroreUsername.value = "";
}
});

// Salvataggio Automatico
const testo = ref("");
const statoSalvataggio = ref("");
let timer = null;

watch(testo, () => {
statoSalvataggio.value = "Sto salvando...";
clearTimeout(timer);
timer = setTimeout(() => {
statoSalvataggio.value = "Salvato!";
}, 1000);
});

return {
eta,
messaggioEta,
carrello,
totaleCarrello,
username,
erroreUsername,
testo,
statoSalvataggio
};
}
}).mount("#app");
