<script setup>
import Acceuil from './components/Accueil.vue'
import VideoSection from './components/VideoSection.vue';

</script>

<template>
  <div class="bigContainer">
    <!-- acceuil -->
   <Acceuil />
    <!-- video -->
    <VideoSection />
  </div>
</template>

<style scoped>
/* Grand div qui contient tous les éléments */
.bigContainer {
  width: 100%; /* Prend toute la largeur */
  background-color: #f5f5f5; /* Fond gris clair (facultatif) */
}





</style>
