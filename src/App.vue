<script setup>
import Acceuil from './components/Accueil.vue'
import Bouton from './components/Bouton.vue'
import Caracteristique from './components/Caracteristique.vue';
import VideoSection from './components/VideoSection.vue';
</script>

<template>
  <div class="bigContainer">
    <!-- Bouton GO RESERVER -->
    <Bouton class="custom-button">
      GO RESERVER
    </Bouton>
    
    <!-- Accueil -->
    <Acceuil />
    
    <!-- Caractéristiques -->
    <Caracteristique />
    
    <!-- Vidéo -->
    <VideoSection />
  </div>
</template>

<style scoped>
/* Grand div qui contient tous les éléments */
.bigContainer {
  width: 100%;
  background-color: #f5f5f5;
  position: relative;
}

/* Fixer le bouton en bas à gauche */
.custom-button {
  position: fixed;
  bottom: 120px; /* Décalage du bas de l'écran */
  right: 100px; /* Décalage du côté gauche de l'écran */
  z-index: 9999; /* S'assurer que le bouton soit au premier plan */
}
</style>
