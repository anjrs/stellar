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
      details: []
    };
  },
  mounted() {
    this.getOrdersWithDetails();
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
    async getOrdersWithDetails() {
      try {
        const tiersName = localStorage.getItem('tiersName');
        if (!tiersName) {
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
        const clientOrders = orders.filter(order => order.ref_client === tiersName);

        this.details = clientOrders.flatMap(order =>
          order.lines.map(line => ({
            id: line.id,
            label: line.product_label || 'Produit inconnu',
            total_ht: line.total_ht || 0,
            qty: line.qty || 1,
            fk_commande: order.id
          }))
        );

        console.log('Détails des commandes :', this.details);
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes :', error);
      }
    },

    async increment(detail) {
  const ancienneQuantite = detail.qty;
  detail.qty++; // mise à jour immédiate du front

  try {
    await axios.put(`http://localhost:7979/dolibarr/htdocs/api/index.php/orders/${detail.fk_commande}/lines/${detail.id}`, {
      qty: detail.qty
    }, {
      headers: {
        'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
        'Content-Type': 'application/json',
        // pas besoin de 'Accept-Encoding'
      }
    });
    console.log(`Quantité mise à jour pour le produit ${detail.label} : ${detail.qty}`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la quantité :', error);

    // Si l’erreur est un bug de réseau (donc update OK côté serveur), on ne fait rien
    if (error.message !== 'Network Error') {
      detail.qty = ancienneQuantite; // rollback si autre erreur
    } else {
      console.warn("Erreur réseau ignorée, la quantité est probablement bien mise à jour côté serveur.");
    }
  }
},

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
          'Content-Type': 'application/json',
        }
      });
      console.log(`Quantité mise à jour pour le produit ${detail.label} : ${detail.qty}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité :', error);

      if (error.message !== 'Network Error') {
        detail.qty = ancienneQuantite; // rollback
      } else {
        console.warn("Erreur réseau ignorée, la quantité est probablement bien mise à jour côté serveur.");
      }
    }
  }
},


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
        this.details = this.details.filter(d => d.id !== id);
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
