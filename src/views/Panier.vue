<script>
import Header from '../components/Header.vue';
import axios from 'axios';

export default {
  name: 'Panier',
  components: {
    Header
  },
  data() {
    return {
      details: [] // Liste des détails des commandes
    };
  },
  mounted() {
    this.getOrdersWithDetails(); // Récupérer les commandes dès que la page est chargée
  },
  computed: {
    totalGeneral() {
      return this.details.reduce((sum, detail) => {
        const totalHT = parseFloat(detail.total_ht || 0);
        return sum + totalHT * detail.qty;
      }, 0);
    }
  },
  methods: {
    // Récupérer les détails des commandes
    async getOrdersWithDetails() {
  try {
    const tiersId = localStorage.getItem('tiersId'); // Récupérer l'ID du client depuis localStorage
    if (!tiersId) {
      console.log('Aucun client connecté.');
      return;
    }

    const response = await axios.get('http://localhost:7979/dolibarr/htdocs/api/index.php/orders', {
      headers: {
        'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
        'Accept': 'application/json'
      }
    });

    const orders = response.data;
    console.log('Commandes récupérées depuis l\'API :', orders);

    // Filtrer les commandes associées au client connecté via ref_client
    const clientOrders = orders.filter(order => order.ref_client === tiersId);

    // Extraire les détails des commandes
    this.details = clientOrders.flatMap(order =>
      order.lines.map(line => ({
        id: line.id,
        label: line.product_label || 'Produit inconnu',
        total_ht: line.total_ht || 0,
        qty: line.qty || 1,
        fk_commande: order.id // ID de la commande pour les mises à jour
      }))
    );

    console.log('Détails des commandes :', this.details);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes :', error);
  }
},
    // Incrémenter la quantité
    async increment(detail) {
      const ancienneQuantite = detail.qty;
      detail.qty++; // mise à jour immédiate du front

      try {
        await axios.put(`http://localhost:7979/dolibarr/htdocs/api/index.php/orders/${detail.fk_commande}/lines/${detail.id}`, {
          qty: detail.qty
        }, {
          headers: {
            'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
            'Content-Type': 'application/json'
          }
        });
        console.log(`Quantité mise à jour pour le produit ${detail.label} : ${detail.qty}`);
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la quantité :', error);
        detail.qty = ancienneQuantite; // rollback si autre erreur
      }
    },

    // Décrémenter la quantité
    async decrement(detail) {
      if (detail.qty > 1) {
        const ancienneQuantite = detail.qty;
        detail.qty--; // mise à jour immédiate du front

        try {
          await axios.put(`http://localhost:7979/dolibarr/htdocs/api/index.php/orders/${detail.fk_commande}/lines/${detail.id}`, {
            qty: detail.qty
          }, {
            headers: {
              'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
              'Content-Type': 'application/json'
            }
          });
          console.log(`Quantité mise à jour pour le produit ${detail.label} : ${detail.qty}`);
        } catch (error) {
          console.error('Erreur lors de la mise à jour de la quantité :', error);
          detail.qty = ancienneQuantite; // rollback si autre erreur
        }
      }
    },

    // Supprimer un produit
    async supprimerProduit(id) {
      const detail = this.details.find(d => d.id === id);
      if (!detail) return;

      try {
        await axios.delete(`http://localhost:7979/dolibarr/htdocs/api/index.php/orders/${detail.fk_commande}/lines/${id}`, {
          headers: {
            'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
            'Content-Type': 'application/json'
          }
        });
        this.details = this.details.filter(d => d.id !== id); // Mettre à jour localement
        console.log(`Produit supprimé : ${detail.label}`);
      } catch (error) {
        console.error('Erreur lors de la suppression du produit :', error);
      }
    }
  }
};
</script>

<template>
    <Header />

  <div class="container">

    <div class="commandes">
      <!-- Détails des commandes -->
      <div class="details">
        <div v-for="detail in details" :key="detail.id" class="commandDetail">
          <div class="nomProduit">{{ detail.label }}</div>
          <div class="prixProduit">{{ parseFloat(detail.total_ht || 0).toLocaleString() }} Ar</div>

          <div class="quantite">
            <div class="quantite-control">
              <button @click="decrement(detail)">-</button>
              <input type="number" :value="detail.qty" readonly />
              <button @click="increment(detail)">+</button>
            </div>
          </div>

          <div class="totalProduit">
            {{ (parseFloat(detail.total_ht || 0) * detail.qty).toLocaleString() }} Ar
          </div>

          <button class="supprimer" @click="supprimerProduit(detail.id)">Supprimer</button>
        </div>
      </div>

      <!-- Total général -->
      <div class="facture">
        <h2>Total général</h2>
        <p>{{ totalGeneral.toLocaleString() }} Ar</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.commandes {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.details {
  flex: 3;
  background-color: transparent;
  border: 3px solid #B1FF36;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  max-height: 70vh;
}

.facture {
  flex: 1;
  background-color: transparent;
  border: 3px solid #B1FF36;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.commandDetail {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px;
  border-bottom: 1px solid #ccc;
  font-family: "AktivGrotesk-Regular", sans-serif;
}

.nomProduit,
.prixProduit,
.quantite,
.totalProduit {
  flex: 1;
  min-width: 100px;
  color: white;
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

.facture h2 {
  font-size: 24px;
  color: #b1ff36;
  margin-bottom: 20px;
}

.facture p {
  font-size: 18px;
  color: white;
}
</style>