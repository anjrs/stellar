<script setup>
  // Utilise directement les chemins d'images
  const starBlack = "/assets/starBlack.svg";
  const stellarBlack = "/assets/stellarBlack.svg";
</script>

<template>
  <div class="home">
    <div class="header">
      <img :src="starBlack" alt="star" class="icon" />
      <img :src="stellarBlack" alt="stellarBlack" class="icon" />

      <div class="pages">
        <router-link to="/produits">NOS PRODUITS</router-link>
        <router-link to="/admin">ADMIN</router-link>

      </div>
    
    </div>
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
