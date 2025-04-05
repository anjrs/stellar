<script scoped>
import Header from '../components/Header.vue'
import CarteProduit from '../components/CarteProduit.vue';
import Champ from '../components/Champ.vue';
import Bouton from '../components/Bouton.vue';
import axios from 'axios'

export default
{
    name: 'Produits',
    components:
    {
        Header,
        CarteProduit,
        Bouton
    },
    data()
    {
        return {
            produits: []
        };
    },
    mounted()
    {
        this.getProduit();
    },
    methods:
    {
    async getProduit()
    {
      try
      {
        const response = await axios.get('http://localhost:7979/dolibarr/htdocs/api/index.php/products',
        {
          headers:
          {
            'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
            'Accept': 'application/json'
          }
        })
        this.produits = response.data
      } 
      catch (error)
      {
        console.error('Erreur lors de la récupération des produits:', error)
      }
    }
  }
}
</script>

<template>
    <Header />

    <div class="container">
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
                :imageSrc="'/assets/produit1.jpg'" 
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