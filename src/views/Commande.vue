<template>
    <Header />

  <div class="container">
    <div class="commande">
      <h1>Mes Commandes</h1>
      <div v-if="commandes.length === 0" class="empty">
        <p>Aucune commande trouvée.</p>
      </div>
      <div v-else class="commande-table">
        <table>
          <thead>
            <tr>
              <th>Référence</th>
              <th>Date</th>
              <th>Total TTC</th>
              <th>Total HT</th>
              <th>Statut</th>
              <!-- <th>Facture</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="commande in commandes" :key="commande.id">
              <td>{{ commande.ref }}</td>
              <td>{{ formatDate(commande.date_creation) }}</td>
              <td>{{ formatCurrency(commande.total_ttc) }}</td>
              <td>{{ formatCurrency(commande.total_ht) }}</td>

              <td>
                <span :class="getStatusClass(commande.status)">
                  {{ getStatusText(commande) }}
                </span>
              </td>

              <!-- <td> -->
                <!-- <a
                  v-if="commande.status === '2' || commande.status === '4'" 
                  :href="`http://localhost:7979/dolibarr/htdocs/commande/card.php?action=classifybilled&token=92f5606db597b624a7846917224d9759&id=${commande.id}`"
                  target="_blank"
                  class="pdf-link"
                >
                  Télécharger
                </a> -->
                <!-- <span v-else>Non disponible</span> -->
              <!-- </td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Header from "../components/Header.vue";

export default {
  components: {
    Header
  },
  data() {
    return {
      commandes: [] // Liste des commandes du client
    };
  },
  mounted() {
    this.getClientOrders(); // Récupérer les commandes dès que la page est chargée
  },
  methods: {
    // Récupérer les commandes du client
    async getClientOrders() {
      try {
        const tiersId = localStorage.getItem("tiersId"); // Récupérer l'ID du client depuis localStorage
        if (!tiersId) {
          console.log("Aucun client connecté.");
          return;
        }

        const response = await axios.get("http://localhost:7979/dolibarr/htdocs/api/index.php/orders", {
          headers: {
            DOLAPIKEY: "8a8MsnQGo371to4oVLWk552rIhNUFIt8",
            Accept: "application/json"
          }
        });

        const orders = response.data;
        console.log("Commandes récupérées depuis l'API :", orders);

        // Filtrer les commandes associées au client connecté et exclure les brouillons
        this.commandes = orders.filter(order => order.ref_client === tiersId && order.status !== "0");
        console.log("Commandes filtrées :", this.commandes);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
      }
    },

    // Formater la date
    formatDate(timestamp) {
      const date = new Date(timestamp * 1000); // Convertir le timestamp en millisecondes
      return date.toLocaleDateString("fr-FR");
    },

    // Formater le montant en devise
    formatCurrency(amount) {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR"
      }).format(amount || 0);
    },

    getStatusText(commande) {
  switch (commande.status) {
    case "0":
      return "Commande créée";

    case "1":
      if (commande.billed && (commande.billed === true || commande.billed === "1")) {
        return "Validé-Facturé";
      } else if (commande.invoice && commande.invoice === "validé") {
        return "Validé-Facture créée";
      } else {
        return "Validé";
      }

    case "2":
      return "Facturée";

    case "3":
      return "Livrée";

    case "4":
      return "Traitée";

    case "-1":
      return "Annulée";

    default:
      return "Statut inconnu";
  }
},

    // Obtenir la classe CSS pour le statut
    getStatusClass(status) {
  switch (status) {
    case "0":
      return "status-commande-creee";
    case "1":
      return "status-validee";
    case "2":
      return "status-facturee";
    case "3":
      return "status-livree";
    case "4":
      return "status-traitee";
    case "-1":
      return "status-annulee";
    default:
      return "status-inconnu";
  }
}
  }
};
</script>

<style scoped>
/* Conteneur principal */
/* Conteneur principal */
.container {
  width: 100vw;
  height: 100vh;
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  font-family: "AktivGrotesk-Regular", sans-serif; /* Police utilisée précédemment */
}

/* Section des commandes */
.commande {
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  /* border: 2px solid #B1FF36; */
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.05); /* Fond légèrement transparent */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Ajout d'une ombre */
}


.commande h1 {
  font-size: 32px;
  margin-bottom: 20px;
  color: #B1FF36;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* Tableau des commandes */
.commande-table table {
  width: 100%;
  border-collapse: collapse;
  color: white;
  font-size: 14px;
}

.commande-table th,
.commande-table td {
  border: 1px solid #B1FF36;
  padding: 12px;
  text-align: left;
}

.commande-table th {
  background-color: rgba(255, 255, 255, 0.1);
  color: #B1FF36;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.commande-table td {
  background-color: rgba(255, 255, 255, 0.02); /* Fond léger pour les cellules */
}

.commande-table tr:nth-child(even) td {
  background-color: rgba(255, 255, 255, 0.05); /* Fond différent pour les lignes paires */
}

.commande-table tr:hover td {
  background-color: rgba(255, 255, 255, 0.1); /* Fond au survol */
}

/* Statuts des commandes */
.status-commande-creee {
  color: gray; /* Commande créée */
}

.status-validee {
  color: #4CAF50; /* Vert pour Validée */
}

.status-facturee {
  color: #FFC107; /* Jaune pour Facturée */
}

.status-livree {
  color: #2196F3; /* Bleu pour Livrée */
}

.status-traitee {
  color: #9C27B0; /* Violet pour Traitée */
}

.status-annulee {
  color: #F44336; /* Rouge pour Annulée */
}

.status-inconnu {
  color: #9E9E9E; /* Gris pour Statut inconnu */
}

/* Message vide */
.empty {
  text-align: center;
  font-size: 18px;
  color: #B1FF36;
  font-style: italic;
  margin-top: 20px;
}

/* Boutons ou liens */
.pdf-link {
  color: #FFA500;
  text-decoration: underline;
  font-size: 14px;
}

.pdf-link:hover {
  color: #FF5722;
}

/* Responsive Design */
@media (max-width: 768px) {
  .commande {
    padding: 15px;
  }

  .commande h1 {
    font-size: 24px;
  }

  /* Tableau des commandes */
.commande-table table {
  width: 500%;
  max-width: 1200px; /* Augmente la largeur maximale de la table */
  border-collapse: collapse;
  color: white;
  font-size: 16px; /* Augmente la taille de la police */
}

.commande-table th,
.commande-table td {
  border: 1px solid #B1FF36;
  padding: 16px; /* Augmente l'espacement interne */
  text-align: left;
}

.commande-table th {
  background-color: rgba(255, 255, 255, 0.1);
  color: #B1FF36;
  font-size: 18px; /* Augmente la taille de la police des en-têtes */
  text-transform: uppercase;
  letter-spacing: 1px;
}

.commande-table td {
  background-color: rgba(255, 255, 255, 0.02); /* Fond léger pour les cellules */
}

.commande-table tr:nth-child(even) td {
  background-color: rgba(255, 255, 255, 0.05); /* Fond différent pour les lignes paires */
}

.commande-table tr:hover td {
  background-color: rgba(255, 255, 255, 0.1); /* Fond au survol */
}
}
</style>