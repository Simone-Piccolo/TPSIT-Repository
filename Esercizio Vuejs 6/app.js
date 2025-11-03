const { createApp } = Vue

// Product Card
const ProductCard = {
  props: ['nomeProdotto', 'prezzo'],
  template: `
    <div class="card">
      <h3>{{ nomeProdotto }}</h3>
      <p>Prezzo: €{{ prezzo }}</p>
    </div>
  `
}

//  Alert Box
const AlertBox = {
  props: ['messaggio', 'tipo'],
  template: `
    <div :class="['alert', tipo]">{{ messaggio }}</div>
  `
}

//  Modal Dialog
const ModalDialog = {
  template: `
    <div class="modal">
      <slot></slot>
      <button @click="$emit('chiudi')">Chiudi</button>
    </div>
  `
}

// Star Rating
const StarRating = {
  template: `
    <div>
      <button v-for="n in 5" :key="n" @click="$emit('imposta-valutazione', n)">⭐</button>
    </div>
  `
}

// App principale
createApp({
  components: { ProductCard, AlertBox, ModalDialog, StarRating },
  data() {
    return {
      prodotti: [
        { nome: 'Laptop', prezzo: 999 },
        { nome: 'Mouse', prezzo: 25 },
        { nome: 'Tastiera', prezzo: 50 }
      ],
      modaleAperta: false,
      valutazione: 0
    }
  }
}).mount('#app')
