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
/* HEADER - Contient les icônes */
.header {
  width: 90%;
  height: 20vh;
  display: flex;
  justify-content: left;
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
.icon
{
  height: 60%; /* Remplit presque tout le header */
  max-height: 90%;
  width: auto;
}

.pages {
  font-family: "Along Sans s2";
  font-size: 1vw;
  color: black;
  display: flex;
  margin-left: auto;
  justify-content: flex-end; /* Aligne à droite */
  padding-right: 3vw; /* Décalage vers la droite */
}

/* i miss u too */
</style>
