<script>
import Bouton from './Bouton.vue';

export default {
  name: 'CarteProduit',
  components:
  {
    Bouton
  },
  props:
  {
    imageSrc:
    {
      type: String,
      required: true
    }
  }
};
</script>

<template>
  <div class="carte">
    <div class="photoProduit">
      <!-- La photo dans un carré arrondi -->
      <img :src="imageSrc" alt="Produit" class="image" />
      
      <!-- Catégorie du produit -->
      <div class="categorie">
        <slot name="categorie">Categorie</slot> <!-- Slot pour la catégorie -->
      </div>
    </div>
    
    <div class="other">
      <div class="detail">
        <!-- Nom et prix alignés -->
        <span class="nom">
          <slot name="nom">Nom du produit</slot> <!-- Slot pour le nom -->
        </span>
        <span class="prix">
          <slot name="prix">Prix du produit</slot> <!-- Slot pour le prix -->
        </span>
      </div>
      
      <div class="boutons">
        <!-- Les boutons sont alignés -->
        <Bouton>
          AJOUTER
        </Bouton>
        <Bouton>
          ACHETER
        </Bouton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carte {
  width: 300px;
  height: 400px;
  border: 3px solid #B1FF36;
  border-radius: 20px;
  background-color: transparent;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.photoProduit {
  position: relative;
  height: 300px; /* Définit la hauteur du div contenant l'image */
  width: 100%; /* Assure que la largeur est complète */
  background-color: transparent;
  overflow: hidden; /* Empêche que l'image dépasse du conteneur */
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cette propriété permet à l'image de couvrir tout le div sans déformation */
  object-position: center; /* Centre l'image dans le div */
  /* Arrondir les bords de l'image */
}

.categorie {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #B1FF36;  /* Couleur similaire à celle du bouton */
  padding: 5px 15px;
  border-radius: 25px;
  font-family: "AktivGrotesk-Regular", sans-serif;
  font-size: 14px;
  color: black;
  text-transform: uppercase;
}

.other {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-family: "AktivGrotesk-Regular", sans-serif;
}

.nom {
  font-weight: bold;
  color: white
}

.prix {
  color: #B1FF36;
  font-weight: bold;
}

.boutons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.custom-button {
  font-family: "AktivGrotesk-Regular", sans-serif;
  font-size: 16px;
  color: #B1FF36;
  background-color: transparent;
  border: 3px solid #B1FF36;
  border-radius: 30px;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  width: 70%;
  max-width: 130px;  /* Limiter la largeur du bouton */
}
</style>
