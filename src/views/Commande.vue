  
  <script>
  import axios from "axios";
  import Header from "../components/Header.vue";
  
  export default {
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
  
      // Obtenir le label du statut
      getStatusLabel(status) {
        switch (status) {
          case "1":
            return "Validée";
          case "2":
            return "Expédiée";
          case "3":
            return "Livrée";
          default:
            return "Inconnu";
        }
      },
  
      // Obtenir la classe CSS pour le statut
      getStatusClass(status) {
        switch (status) {
          case "1":
            return "status-validee";
          case "2":
            return "status-expediee";
          case "3":
            return "status-livree";
          default:
            return "status-inconnu";
        }
      }
    }
  };
  </script>
  
<template>
    <Header />
    <div class="container">
      <div class="commande">
        <h1>Mes Commandes</h1>
        <div v-if="commandes.length === 0" class="empty">
          <p>Aucune commande trouvée.</p>
        </div>
        <div v-else class="commande-list">
          <div v-for="commande in commandes" :key="commande.id" class="commande-item">
            <div class="commande-info">
              <h2>Commande #{{ commande.ref }}</h2>
              <p>Date : {{ formatDate(commande.date_creation) }}</p>
              <p>Status : <span :class="getStatusClass(commande.status)">{{ getStatusLabel(commande.status) }}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  
  <style scoped>
  /* Conteneur principal */
  .container {
    width: 100vw;
    height: 100vh;
    background-color: black;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Section des commandes */
  .commande {
    width: 100%;
    max-width: 900px;
    padding: 40px;
    border: 3px solid #B1FF36;
    border-radius: 20px;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    color: white;
  }
  
  .commande h1 {
    font-size: 28px;
    margin-bottom: 20px;
    color: #B1FF36;
  }
  
  /* Liste des commandes */
  .commande-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .commande-item {
    padding: 20px;
    border: 2px solid #B1FF36;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .commande-info h2 {
    font-size: 20px;
    color: #B1FF36;
  }
  
  .commande-info p {
    margin: 0;
    font-size: 16px;
  }
  
  /* Statut des commandes */
  .status-validee {
    color: #4CAF50; /* Vert */
  }
  
  .status-expediee {
    color: #FFC107; /* Jaune */
  }
  
  .status-livree {
    color: #2196F3; /* Bleu */
  }
  
  .status-inconnu {
    color: #F44336; /* Rouge */
  }
  
  /* Message vide */
  .empty {
    text-align: center;
    font-size: 18px;
    color: #B1FF36;
  }
  </style>