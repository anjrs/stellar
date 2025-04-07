<script>
import Champ from '../components/Champ.vue';
import Bouton from '../components/Bouton.vue';
import axios from 'axios';

export default {
  name: 'Inscription',
  components: {
    Champ,
    Bouton
  },
  data() {
    return {
      stellarWhite: "/assets/stellarWhite.svg", // Logo
      name: '', // Nom du client
      email: '', // Email du client
      phone: '' // Téléphone du client
    };
  },
  methods: {
    // Fonction pour créer une commande (panier)
    async creerPanier(clientId) {
      try {
        const data = {
          ref_client: clientId, // Référence client (id)
          socid: clientId, // ID du client
          date: new Date().toISOString().split('T')[0], // Date de la commande
          lines: [] // Lignes de commande (vide pour l'instant)
        };

        console.log('Création du panier avec les données :', data);

        const response = await axios.post('http://localhost:7979/dolibarr/htdocs/api/index.php/orders', data, {
          headers: {
            'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
            'Content-Type': 'application/json'
          }
        });

        console.log('Panier créé avec succès :', response.data);
        return response.data.id; // Retourner l'ID de la commande créée
      } catch (error) {
        console.error('Erreur lors de la création du panier :', error);
        alert('Une erreur est survenue lors de la création du panier.');
      }
    },

    // Fonction pour soumettre le formulaire
    async submitForm() {
      if (!this.name || !this.email || !this.phone) {
        alert('Veuillez remplir tous les champs.');
        return;
      }

      const data = {
        name: this.name,
        client: 1, // Type de client (1 = client)
        status: 1, // Statut actif
        email: this.email,
        phone_pro: this.phone
      };

      console.log('Données envoyées :', data);

      try {
        // Création du tiers (client)
        const response = await axios.post('http://localhost:7979/dolibarr/htdocs/api/index.php/thirdparties', data, {
          headers: {
            'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
            'Content-Type': 'application/json'
          }
        });

        console.log('Réponse complète de l\'API :', response.data);

        // Récupérer l'ID du client créé
        const clientId = response.data; // Adaptez selon la structure réelle
        console.log('ID du client créé :', clientId);

          // Stocker les informations du client dans le localStorage
        localStorage.setItem('emailConnecte', this.email); // Stocke l'email du client
        localStorage.setItem('tiersId', clientId); // Stocke l'ID du client
        localStorage.setItem('tiersName', this.name); // Stocke le nom du client
        console.log('Informations du client mises à jour dans localStorage.');
          console.log('tiersId mis à jour dans localStorage :', clientId);

        if (!clientId) {
          console.error('Erreur : l\'ID du client est introuvable.');
          alert('Une erreur est survenue lors de la création du client.');
          return;
        }

        // Créer une commande (panier) pour ce client
        const panierId = await this.creerPanier(clientId);
        if (panierId) {
          console.log('Commande brouillon créée avec succès, ID :', panierId);
        } else {
          console.error('Erreur : le panier n\'a pas été créé.');
        }

        // Rediriger vers la page Produits
        this.$router.push('/produits');
      } catch (error) {
        console.error('Erreur lors de l\'envoi des données :', error);
        alert('Une erreur est survenue lors de l\'inscription.');
      }
    }
  }
};
</script>

<template>
  <div class="container">
    <div class="formulaire">
      <div class="logo">
        <img :src="stellarWhite" alt="Logo Stellar" class="icon" />
      </div>

      <div class="champs">
        <Champ 
          label="Nom"
          type="text" 
          placeholder="Entrez votre nom" 
          v-model="name" 
        />
        <Champ 
          label="E-mail" 
          type="email"
          placeholder="Entrez votre adresse e-mail" 
          v-model="email" 
        />
        <Champ 
          type="text"
          label="Contact" 
          placeholder="Entrez votre numéro de téléphone" 
          v-model="phone" 
        />
        <Bouton class="custom-button" @click="submitForm">
          S'INSCRIRE
        </Bouton>
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

/* Formulaire */
.formulaire {
  width: 100%;
  height: auto;
  max-width: 900px;
  padding: 40px;
  border: 3px solid #B1FF36;
  border-radius: 60px;
  background-color: transparent;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 50px auto;
  position: relative;
}

/* Logo */
.logo {
  width: 40%;
  margin-bottom: 20px;
}

.icon {
  height: auto;
  max-height: 80px;
  width: auto;
  position: relative;
  display: block;
  margin: 0 auto;
}

/* Champs */
.champs {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Bouton personnalisé */
.custom-button {
  background-color: #B1FF36;
  color: black;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
}

.custom-button:hover {
  background-color: white;
  color: black;
}
</style>