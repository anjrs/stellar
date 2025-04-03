<script setup>
// Utilisation du chemin direct car l'image est dans `public/assets/`
const backgroundImage = "/assets/caracteristique.png";
</script>

<template>
    <div class="caracteristique">
      <h6 class="top-left">Aura +1000</h6>
      <h6 class="bottom-right">Aura +1000</h6>
    </div>
  </template>
  
  <style scoped>
  /* Importation de la police (assure-toi que Croco Tears est bien disponible) */
  @font-face {
    font-family: "Croco Tears";
    src: url("/assets/fonts/CrocoTears.ttf") format("truetype"); /* Mets le bon chemin */
  }
  
  .caracteristique {
    width: 100vw;  
    height: 100vh; 
    background-image: url("/assets/caracteristique.png"); 
    background-size: cover; 
    background-position: center; 
    background-repeat: no-repeat;
    position: relative; /* Nécessaire pour positionner les h6 */
  }
  
  /* Style du texte */
  h6 {
    font-family: "Croco Tears", sans-serif;
    font-size:6vw; /* Très grand */
    color: rgb(0, 0, 0); /* Mets une autre couleur si nécessaire */
    position: absolute;
    margin: 0;
  }
  
  /* Haut gauche */
  .top-left {
    top: 5%;
    left: 5%;
  }
  
  /* Bas droite */
  .bottom-right {
    bottom: 5%;
    right: 5%;
  }
  </style>
  
