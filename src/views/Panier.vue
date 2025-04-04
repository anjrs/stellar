<script>
import Header from '../components/Header.vue'

export default {
  name: 'Panier',
  components: {
    Header
  },
  data() {
    return {
      panier: [
        {
          id: 1,
          nom: 'Produit A',
          prix: 10000,
          quantite: 1,
          image: 'https://via.placeholder.com/80'
        },
        {
          id: 2,
          nom: 'Produit B',
          prix: 15000,
          quantite: 2,
          image: 'https://via.placeholder.com/80'
        }
      ]
    }
  },
  computed: {
    totalGeneral() {
      return this.panier.reduce((sum, p) => sum + p.prix * p.quantite, 0);
    }
  },
  methods: {
    increment(p) {
      p.quantite++;
    },
    decrement(p) {
      if (p.quantite > 1) p.quantite--;
    },
    supprimerProduit(id) {
      this.panier = this.panier.filter(p => p.id !== id);
    }
  }
}
</script>
<template>
    <Header />
  
    <div v-for="produit in panier" :key="produit.id" class="commandDetail">
      <img :src="produit.image" alt="Image produit" class="imageProduit" />
      
      <div class="nomProduit">{{ produit.nom }}</div>
      <div class="prixProduit">{{ produit.prix.toLocaleString() }} Ar</div>
      
      <div class="quantite">
        <div class="quantite-control">
          <button @click="decrement(produit)">-</button>
          <input type="number" :value="produit.quantite" readonly />
          <button @click="increment(produit)">+</button>
        </div>
      </div>
  
      <div class="totalProduit">{{ (produit.prix * produit.quantite).toLocaleString() }} Ar</div>
  
      <button class="supprimer" @click="supprimerProduit(produit.id)">Supprimer</button>
    </div>
  
    <div class="facture">
      <h2>Total général : {{ totalGeneral.toLocaleString() }} Ar</h2>
    </div>
  </template>
  

<style scoped>
.commandDetail {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px 30px;
  border-bottom: 1px solid #ccc;
  font-family: "AktivGrotesk-Regular", sans-serif;
}

.imageProduit {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
}

.nomProduit,
.prixProduit,
.quantite,
.totalProduit {
  flex: 1;
  min-width: 100px;
}

.quantite-control {
  display: flex;
  align-items: center;
  gap: 5px;
}

.quantite-control button {
  background-color: #b1ff36;
  border: none;
  padding: 5px 10px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 5px;
}

.quantite-control input {
  width: 50px;
  text-align: center;
  font-size: 16px;
  background-color: #f7f7f7;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.supprimer {
  background-color: red;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.facture {
  margin-top: 40px;
  padding: 20px;
  border-top: 2px solid #b1ff36;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

</style>