<script setup>
    const starBlack = "/assets/starBlack.svg";
    const stellarBlack = "/assets/stellarBlack.svg";
</script>

<template>
    <div class="header">
      <img :src="starBlack" alt="star" class="icon" />
      <img :src="stellarBlack" alt="stellarBlack" class="icon" />

      <div class="pages">
        <router-link to="/">ACCUEIL</router-link>
        <router-link to="/produits">SHOP</router-link>
        <router-link to="/admin">CONNEXION</router-link>
        <router-link to="/panier">PANIER</router-link>
        <router-link to="/commande">COMMANDES</router-link>


        </div>
    </div>
    
</template>

<style scoped>
.header {
  width: 90%;
  height: 20vh;
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 20px;
}

/* ICONES */
.icon {
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
  gap: 30px; /* Espacement entre les liens */
}

.pages a {
  text-decoration: none; /* Supprime le soulignement par défaut */
  color: black; /* Couleur noire pour les liens */
  transition: all 0.3s ease; /* Transition pour un effet fluide */
}

.pages a:hover {
  text-decoration: underline; /* Ajoute un soulignement au survol */
  color: #B1FF36; /* Change la couleur au survol (vert) */
}
</style>