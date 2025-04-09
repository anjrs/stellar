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
      tiersId: '',
      categoriesMap: new Map(), // Pour stocker les catégories
      newNote: {}
    }
  },

// Dans Produits.vue - modifications dans la méthode mounted()
mounted() {
  this.emailConnecte = localStorage.getItem('emailConnecte');
  this.tiersName = localStorage.getItem('tiersName');
  this.tiersId = localStorage.getItem('tiersId');

  if (this.emailConnecte) {
    // Modifié pour s'assurer que tiersId est bien défini
    this.getTiersIdByEmail(this.emailConnecte).then(() => {
      // Ne récupérer la commande qu'après avoir obtenu l'ID du tiers
      this.recupererCommandeIdExistante();
    });
  }

  this.getProduit();
  this.getCategories();
},


  methods: {
    // ===== FONCTIONS RELATIVES AUX PRODUITS =====
    async getProduit() {
      try {
        // 1. Récupérer tous les produits
        const productsResponse = await axios.get('http://localhost:7979/dolibarr/htdocs/api/index.php/products', {
          headers: {
            'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
            'Accept': 'application/json'
          },
          params: {
            limit: 100 // Ajustez selon vos besoins
          }
        });
        
        // Stocker temporairement les produits
        const productsData = productsResponse.data;
        this.produits = [];
        
        // 2. Pour chaque produit, récupérer ses catégories
        for (const produit of productsData) {
          // Appel à l'API pour obtenir les catégories du produit
          try {
            const categoriesResponse = await axios.get(
              `http://localhost:7979/dolibarr/htdocs/api/index.php/products/${produit.id}/categories`, 
              {
                headers: {
                  'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
                  'Accept': 'application/json'
                }
              }
            );
            
            // Ajouter les informations de catégorie au produit
            const categories = categoriesResponse.data || [];
            const categorieLabels = categories.map(cat => cat.label).join(', ');
            
            this.produits.push({
              ...produit,
              categories: categories,
              categorieLabel: categorieLabels || 'Non catégorisé'
            });
            
          } catch (error) {
            console.error(`Erreur lors de la récupération des catégories pour le produit ${produit.id}:`, error);
            // En cas d'erreur, on ajoute quand même le produit mais sans catégorie
            this.produits.push({
              ...produit,
              categories: [],
              categorieLabel: 'Non catégorisé'
            });
          }
        }
        
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    },
    
    async getProduitAlternative() {
      try {
        // 1. Récupérer tous les produits
        const productsResponse = await axios.get('http://localhost:7979/dolibarr/htdocs/api/index.php/products', {
          headers: {
            'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
            'Accept': 'application/json'
          }
        });
        
        // 2. Récupérer toutes les catégories de produits
        const categoriesResponse = await axios.get('http://localhost:7979/dolibarr/htdocs/api/index.php/categories?type=product', {
          headers: {
            'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
            'Accept': 'application/json'
          }
        });
        
        // 3. Récupérer toutes les associations produit-catégorie
        const categoryProductsMap = new Map();
        
        for (const categorie of categoriesResponse.data) {
          try {
            const catProductsResponse = await axios.get(
              `http://localhost:7979/dolibarr/htdocs/api/index.php/categories/${categorie.id}/products`,
              {
                headers: {
                  'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
                  'Accept': 'application/json'
                }
              }
            );
            
            // Pour chaque produit dans cette catégorie
            for (const produit of catProductsResponse.data) {
              if (!categoryProductsMap.has(produit.id)) {
                categoryProductsMap.set(produit.id, []);
              }
              categoryProductsMap.get(produit.id).push({
                id: categorie.id,
                label: categorie.label
              });
            }
          } catch (error) {
            console.error(`Erreur lors de la récupération des produits pour la catégorie ${categorie.id}:`, error);
          }
        }
        
        // 4. Associer les catégories aux produits
        this.produits = productsResponse.data.map(produit => {
          const productCategories = categoryProductsMap.get(produit.id) || [];
          const categorieLabels = productCategories.map(cat => cat.label).join(', ');
          
          return {
            ...produit,
            categories: productCategories,
            categorieLabel: categorieLabels || 'Non catégorisé'
          };
        });
        
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    },

    // ===== FONCTIONS RELATIVES AUX CATÉGORIES =====
    async getCategories() {
      try {
        const response = await axios.get('http://localhost:7979/dolibarr/htdocs/api/index.php/categories?type=product', {
          headers: {
            'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
            'Accept': 'application/json'
          }
        });

        const categories = response.data;

        // Créer un Map pour associer les IDs de catégories à leurs labels
        const categoriesMap = new Map();
        categories.forEach(category => {
          categoriesMap.set(category.id, category.label);
        });

        this.categoriesMap = categoriesMap; // Stocker le Map dans le composant
        console.log('Catégories récupérées :', this.categoriesMap);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
      }
    },

    // ===== FONCTIONS RELATIVES AUX CLIENTS/TIERS =====
    // Mise à jour de getTiersIdByEmail pour définir tiersId
async getTiersIdByEmail(email) {
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
      localStorage.setItem('tiersId', foundTiers.id); // Ajout crucial
      this.tiersName = foundTiers.name;
      this.tiersId = foundTiers.id; // Ajout crucial
      console.log("✅ Client trouvé :", this.tiersName, "avec ID:", this.tiersId);
      return foundTiers.id;
    } else {
      localStorage.removeItem('tiersName');
      localStorage.removeItem('tiersId'); // Ajout crucial
      this.tiersName = '';
      this.tiersId = '';
      console.log("❌ Aucun tiers trouvé avec cet email.");
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des tiers:', error);
    return null;
  }
},

// Modification de recupererCommandeIdExistante pour mieux gérer les cas d'erreur
async recupererCommandeIdExistante() {
  try {
    const tiersId = this.tiersId || localStorage.getItem('tiersId'); // Utilise l'ID du client
    console.log('tiersId utilisé pour rechercher les commandes:', tiersId);

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

    // Vérifiez le format exact des données retournées pour vous assurer que la condition est correcte
    // Il est possible que vous deviez utiliser cmd.socid ou un autre champ pour identifier le client
    const commandeClient = commandes.find(cmd => 
      cmd.socid === parseInt(tiersId) || 
      cmd.ref_client === tiersId ||
      cmd.socid === tiersId // Essayez différentes options selon votre structure de données
    );
    
    console.log('Commande client trouvée :', commandeClient);

    if (commandeClient && commandeClient.id) {
      console.log('Commande ID retourné :', commandeClient.id);
      localStorage.setItem('commandeId', String(commandeClient.id)); // Stocke l'ID de la commande
      return commandeClient.id;
    } else {
      console.log("Aucune commande existante trouvée, création d'une nouvelle commande...");
      // Si aucune commande n'existe, créez-en une nouvelle
      return await this.creerNouvelleCommande(tiersId);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande :", error);
    localStorage.removeItem('commandeId'); // Supprime l'ancienne commande en cas d'erreur
    return null;
  }
},

// Ajout d'une méthode pour créer une nouvelle commande si aucune n'existe
async creerNouvelleCommande(tiersId) {
  try {
    console.log('Création d\'une nouvelle commande pour le client:', tiersId);
    
    const nouvelleCommande = {
      socid: parseInt(tiersId),
      ref_client: tiersId.toString(),
      date: Math.floor(Date.now() / 1000), // Date actuelle en timestamp
      type: 0, // Type standard
      status: 0 // Brouillon
    };
    
    const response = await axios.post(
      'http://localhost:7979/dolibarr/htdocs/api/index.php/orders',
      nouvelleCommande,
      {
        headers: {
          'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    if (response.data && response.data.id) {
      console.log('Nouvelle commande créée avec ID:', response.data.id);
      localStorage.setItem('commandeId', String(response.data.id));
      return response.data.id;
    } else {
      console.error('Échec de création de la commande, réponse:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    return null;
  }
},

// Mise à jour de la méthode ajouterAuPanier
async ajouterAuPanier(produit) {
  console.log('🛒 Produit reçu dans le parent :', produit);
  try {
    // Vérifier que l'utilisateur est connecté
    if (!this.tiersId) {
      alert("Vous devez être connecté pour ajouter des produits au panier.");
      return;
    }
    
    // Récupérer l'ID de la commande
    let commandeId = localStorage.getItem('commandeId');
    console.log('Commande ID récupéré depuis localStorage :', commandeId);

    // Si aucune commande n'existe, en créer une nouvelle
    if (!commandeId) {
      console.log('Aucune commande ID trouvée. Tentative de récupération ou création...');
      commandeId = await this.recupererCommandeIdExistante();
      
      if (!commandeId) {
        alert("Impossible de créer ou récupérer une commande pour ce client.");
        return;
      }
    }

    console.log('Ajout du produit à la commande ID :', commandeId);
    console.log('Données du produit :', produit);

    // Construction des données pour la ligne de commande
    const ligneCommande = {
      fk_product: produit.id,
      qty: 1,
      subprice: produit.price,
      tva_tx: produit.tva_tx || 0,
      remise_percent: 0,
      price_base_type: "HT",
      desc: produit.label || "Produit",
      product_type: 0
    };

    console.log('Données envoyées à l\'API :', ligneCommande);

    // Envoi de la requête POST
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
    console.error('Détails de l\'erreur:', error.response ? error.response.data : error.message);
    alert('Erreur lors de l\'ajout au panier. Veuillez réessayer.');
  }
},
    // ===== FONCTIONS RELATIVES AUX NOTES =====
    getCurrentNote(produit) {
      // Vérifie si le produit a une note dans ses options
      return produit.array_options?.options_note || 0; // Retourne 0 si aucune note n'existe
    },

    async updateNote({ produit, note }) {
  try {
    // Vérifiez si le produit est défini
    if (!produit || !produit.id) {
      console.error('Produit non défini ou ID manquant.');
      return;
    }

    // Vérifiez si une nouvelle note est disponible
    const userNote = parseFloat(note) || 0;
    if (!userNote) {
      console.error('Nouvelle note non définie ou invalide.');
      return;
    }

    // Récupérez la note actuelle (par défaut 0 si elle n'existe pas)
    const currentNote = parseFloat(this.getCurrentNote(produit)) || 0;

    // Si la note actuelle est 0 ou undefined, utilisez directement la nouvelle note
    const nouvelleNote = currentNote === 0 ? userNote : (currentNote + userNote) / 2;

    // Mettez à jour le produit sur le serveur
    const response = await axios.put(
      `http://localhost:7979/dolibarr/htdocs/api/index.php/products/${produit.id}`,
      {
        array_options: {
          options_note: nouvelleNote
        }
      },
      {
        headers: {
          'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Encoding': 'identity'
        }
      },
    );

    // Vérifiez si la mise à jour a réussi
    if (response.status === 200) {
      console.log(`✅ Note mise à jour pour le produit ${produit.id} : ${nouvelleNote}`);
      // Mettez à jour la note du produit localement
      produit.array_options = produit.array_options || {};
      produit.array_options['options_note'] = nouvelleNote;
    } else {
      console.error(`❌ Échec de la mise à jour pour le produit ${produit.id}`);
    }
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la note pour le produit ${produit.id} :`, error);
  }
},
  }
};
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
        <Champ placeholder="Rechercher un produit" type="text"/> 
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
        @update-note="updateNote"
        @ajouter="ajouterAuPanier"
      >
        <template #categorie>
          {{ produit.categorieLabel }}
        </template>
        <template #nom>
          {{ produit.label }}
        </template>
        <template #noteActuelle>
          {{ getCurrentNote(produit) }} 
        </template>
      </CarteProduit>  
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 500vh;
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
  align-items: center; /* Centre verticalement les éléments */
  justify-content: left; /* Centre horizontalement les éléments */
  gap: 0px; /* Espace entre la barre de recherche et le bouton */
  margin-bottom: 60px; /* Espace en bas */
  padding-left: 50px; /* Espace à gauche et à droite */
}

.searchBar {
  font-family: "AktivGrotesk-Regular", sans-serif;
  font-size: 16px;
  color: #B1FF36;
  background-color: transparent;
  /* border: 2px solid #B1FF36; Ajout d'une bordure verte */
  border-radius: 30px;
  padding: 10px 20px; /* Espacement interne */
  display: flex;
  align-items: center; /* Centre verticalement le contenu */
  justify-content: flex-start; /* Aligne le texte à gauche */
  transition: all 0.3s ease;
  width: 100%; /* Prend toute la largeur disponible */
  max-width: 300px; /* Limite la largeur maximale */
  height: 40px; /* Hauteur ajustée */
}

.carteContainer {
  width: 90%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Centre les cartes horizontalement */
  gap: 40px; /* Espace entre les cartes */
}

.champs {
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 10%;
}
</style>