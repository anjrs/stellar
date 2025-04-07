<script>
import Header from '../components/Header.vue'
import CarteProduit from '../components/CarteProduit.vue'
import Champ from '../components/Champ.vue'
import Bouton from '../components/Bouton.vue'
import axios from 'axios'

export default {
  name: 'Produits',
  components: {
    Header,
    CarteProduit,
    Bouton,
    Champ
  },
  data() {
    return {
      produits: [],
      emailConnecte: '',
      tiersName: '',
    }
  },

  mounted() {
    this.emailConnecte = localStorage.getItem('emailConnecte');
    this.tiersName = localStorage.getItem('tiersName');
    this.tiersId = localStorage.getItem('tiersId');

    if (this.emailConnecte) {
      this.getTiersIdByEmail(this.emailConnecte);
    }

    this.getProduit();
    // 🔍 Test pour voir si la fonction est bien appelée
    this.recupererCommandeIdExistante(); 
  },

  methods: {
    async getProduit() {
      try {
        const response = await axios.get('http://localhost:7979/dolibarr/htdocs/api/index.php/products', {
          headers: {
            'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
            'Accept': 'application/json'
          }
        });
        this.produits = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    },

    async getTiersIdByEmail(email)
    {
      try {
        const response = await axios.get('http://localhost:7979/dolibarr/htdocs/api/index.php/thirdparties', {
          headers: {
            'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
            'Accept': 'application/json'
          }
        });

        const tiers = response.data;
        const foundTiers = tiers.find(tier => tier.email === email);

        if (foundTiers) {
          localStorage.setItem('tiersName', foundTiers.name);
          this.tiersName = foundTiers.name;
          console.log("✅ Client trouvé :", this.tiersName);
        } else {
          localStorage.removeItem('tiersName');
          this.tiersName = '';
          console.log("❌ Aucun tiers trouvé avec cet email.");
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des tiers:', error);
      }
    },
    
    async recupererCommandeIdExistante() {
  try {
    const tiersId = localStorage.getItem('tiersId'); // Utilise l'ID du client
    console.log('tiersId récupéré depuis localStorage :', tiersId);

    if (!tiersId) {
      console.log('Aucun client connecté.');
      localStorage.removeItem('commandeId'); // Supprime l'ancienne commande
      return null;
    }

    const response = await axios.get('http://localhost:7979/dolibarr/htdocs/api/index.php/orders', {
      headers: {
        'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
        'Accept': 'application/json'
      }
    });

    const commandes = response.data;
    console.log('Commandes récupérées depuis l\'API :', commandes);

    // Trouver la commande associée au client connecté
    const commandeClient = commandes.find(cmd => cmd.ref_client === tiersId);
    console.log('Commande client trouvée :', commandeClient);

    if (commandeClient && commandeClient.id) {
      console.log('Commande ID retourné :', commandeClient.id);
      localStorage.setItem('commandeId', String(commandeClient.id)); // Stocke l'ID de la commande
      return commandeClient.id;
    } else {
      console.log("Aucune commande existante trouvée.");
      localStorage.removeItem('commandeId'); // Supprime l'ancienne commande
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande :", error);
    localStorage.removeItem('commandeId'); // Supprime l'ancienne commande en cas d'erreur
    return null;
  }
},

async ajouterAuPanier(produit) {
  try {
    // Récupérer l'ID de la commande depuis le localStorage
    let commandeId = localStorage.getItem('commandeId');
    console.log('Commande ID récupéré depuis localStorage :', commandeId);

    // Si aucune commande n'est trouvée dans le localStorage
    if (!commandeId) {
      console.log('Aucune commande ID trouvée dans localStorage. Récupération via API...');
      commandeId = await this.recupererCommandeIdExistante();
      console.log('Commande ID récupéré depuis l\'API :', commandeId);

      if (!commandeId) {
        alert("Aucune commande trouvée pour ce client.");
        return;
      }

      // Stocker l'ID de la commande dans le localStorage
      localStorage.setItem('commandeId', String(commandeId));
      console.log('Commande ID stocké dans localStorage :', commandeId);
    }

    console.log('Ajout du produit à la commande ID :', commandeId);
    console.log('Données du produit :', produit);

    // Construction des données à envoyer
    const ligneCommande = {
      fk_product: produit.id,
      qty: 1,
      subprice: produit.price,
      tva_tx: 0,
      remise_percent: 0,
      price_base_type: "HT",
      desc: produit.label || "Produit",
      product_type: 0
    };

    console.log('Données envoyées à l’API :', ligneCommande);

    // Envoi de la requête POST pour ajouter la ligne
    const response = await axios.post(
      `http://localhost:7979/dolibarr/htdocs/api/index.php/orders/${commandeId}/lines`,
      ligneCommande,
      {
        headers: {
          'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Réponse de l\'API après ajout :', response.data);
    alert(`Produit "${produit.label}" ajouté au panier.`);
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier :', error);
    alert('Ajouté au panier');
  }
},

async getSocIdByEmail(email) {
      try {
        const response = await axios.get('http://localhost:7979/dolibarr/htdocs/api/index.php/thirdparties', {
          headers: {
            'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
            'Accept': 'application/json'
          }
        });

        const tiers = response.data.find(tier => tier.email === email);
        return tiers ? tiers.id : null;
      } catch (error) {
        console.error('Erreur dans getSocIdByEmail :', error);
        return null;
      }
    }
  }
}
</script>

<template>
    <Header />
    <div class="container">
        <div class="texte">
            <h1>Bienvenue {{ tiersName }}</h1> 
            <h2>Découvrez nos produits</h2>
        </div>
        <div class="rechercheEtBouton">
            <div class="searchBar">
                <Champ placeholder="Rechercher un produit" type="text" class="champs"/>
            </div>
            <Bouton class="bouton">
                RECHERCHER
            </Bouton>
        </div>
        <div class="carteContainer">
            <CarteProduit
                v-for="produit in produits"
                :key="produit.id"
                :produit="produit"
                
                @ajouter="ajouterAuPanier(produit)"
            >
                <template #categorie>
                    {{ produit.description }}
                </template>
                <template #nom>
                    {{ produit.label }}
                </template>
                <template #prix>
                    {{ parseFloat(produit.price).toLocaleString() }} Ariary
                </template>
              </CarteProduit>
              
        </div>
        
    </div>
</template>

<style scoped>
.container {
    width: 100vw;
    height: 100vh;
    padding-top: 70px; /* Évite que le contenu soit caché par le header */
    background-color: black;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; /* Aligne tout en haut */
}
.texte {
    text-align: center; /* Centre le texte horizontalement */
    margin-bottom: 20px; /* Espace sous le bloc texte */
}

.texte h1 {
    font-family: "AktivGrotesk-Regular", sans-serif; /* Police personnalisée */
    font-size: 36px; /* Taille du texte */
    color: #B1FF36; /* Couleur verte */
    margin-bottom: 10px; /* Espace sous le titre */
    text-transform: uppercase; /* Met le texte en majuscules */
    letter-spacing: 2px; /* Espacement entre les lettres */
}

.texte h2 {
    font-family: "AktivGrotesk-Regular", sans-serif; /* Police personnalisée */
    font-size: 24px; /* Taille du texte */
    color: #FFFFFF; /* Couleur blanche */
    margin-bottom: 20px; /* Espace sous le sous-titre */
    font-weight: 300; /* Poids de la police plus léger */
}

.texte p {
    font-family: "AktivGrotesk-Regular", sans-serif; /* Police personnalisée */
    font-size: 18px; /* Taille du texte */
    color: #CCCCCC; /* Couleur grise */
    line-height: 1.6; /* Hauteur de ligne pour améliorer la lisibilité */
    margin-bottom: 15px; /* Espace sous le paragraphe */
}
.rechercheEtBouton {
    width: 100%;
    display: flex;
    flex-direction: row; /* Aligne les éléments horizontalement */
    /* Aligne les éléments à gauche */
    align-items: center; /* Aligne verticalement les éléments */
    gap: 20px; /* Espace entre la barre de recherche et le bouton */
    margin-left: 10%;
    margin-bottom: 40px;
}

.searchBar {
    font-family: "AktivGrotesk-Regular", sans-serif;
    font-size: 16px;
    color: #B1FF36;
    background-color: transparent;
    border: 3px solid #B1FF36;
    border-radius: 30px;
    padding: 10px 20px;
    cursor: text;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    transition: all 0.3s ease;
    width: 90%;
    height: 30px; /* Hauteur ajustable */
    max-width: 500px; /* Largeur ajustable */
    margin-left: 0; /* Ajuste la position à gauche */
}

.carteContainer {
    width: 90%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center; /* Centre les cartes horizontalement */
    gap: 40px; /* Espace entre les cartes */
}

.champs
{
    width: 80%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 10%;
}



</style>