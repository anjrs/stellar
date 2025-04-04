<script setup>
import Header from './Header.vue';
  // Utilise directement les chemins d'images
  const starBlack = "/assets/starBlack.svg";
  const stellarBlack = "/assets/stellarBlack.svg";
</script>

<template>
  <div class="home">
    <Header />
    <div class="imageEclair"></div>
  </div>
</template>

<style scoped>
/* HOME - Conteneur principal */
.home {
  width: 100vw;
  height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start; /* Pour que le header reste en haut */
}

/* IMAGE ÉCLAIR */
.imageEclair {
  width: 100%;
  height: 80vh; /* Prend 80% de home */
  background-image: url("/assets/eclair.png"); /* Chemin absolu */
  background-size: cover;
  background-position: center;
}



/* i miss u too */
</style>
