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
    </div>
    <div class="imageEclair"></div>
  </div>
</template>

<style scoped>
/* HEADER - Contient les icônes */
.header {
  width: 100%;
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

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

/* ICONES */
.icon {
  height: 80%; /* Remplit presque tout le header */
  max-height: 100%;
  width: auto;
}
 

/* i miss u too */
</style>
