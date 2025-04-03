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

<style>
@font-face {
  font-family: "Croco Tears";
  src: url("/assets/fonts/CrocoTears.ttf") format("truetype");
}

.caracteristique {
  width: 100vw;
  height: 100vh;
  background-image: url("/assets/caracteristique.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* Empêche le texte de sortir de l'écran */
}

/* Style du texte */
h6 {
  font-family: "Croco Tears", sans-serif;
  font-size: 6vw;
  color: rgb(0, 0, 0);
  position: absolute;
  margin: 0;
  white-space: nowrap; /* Empêche le texte de passer à la ligne */
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* Animation pour le texte en haut à gauche */
@keyframes moveLeftToRight {
  0% {
    left: -20vw; /* Commence en dehors de l'écran à gauche */
  }
  100% {
    left: 120vw; /* Va complètement hors de l'écran à droite */
  }
}

/* Animation pour le texte en bas à droite */
@keyframes moveRightToLeft {
  0% {
    right: -20vw; /* Commence en dehors de l'écran à droite */
  }
  100% {
    right: 120vw; /* Va complètement hors de l'écran à gauche */
  }
}

/* Assignation des animations */
.top-left {
  top: 5%;
  left: -20vw;
  animation: moveLeftToRight 8s linear infinite;
}

.bottom-right {
  bottom: 5%;
  right: -20vw;
  animation: moveRightToLeft 8s linear infinite;
}
</style>
