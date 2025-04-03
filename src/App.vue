<script setup>
import Acceuil from './components/Acceuil.vue'
import starBlack from './assets/starBlack.svg';
import stellarBlack from './assets/stellarBlack.svg';
import stellarYellow from './assets/stellarYellow.svg';

import { ref, onMounted, onUnmounted } from 'vue';

// resaka video automatique
const videoRef = ref(null);

const handleScroll = () => {
  if (!videoRef.value) return;

  const rect = videoRef.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Si la vidéo est à au moins 30% visible à l'écran, on la joue
  if (rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3) {
    videoRef.value.play();
  } else {
    videoRef.value.pause();
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Vérifie au chargement
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

</script>

<template>
  <div class="bigContainer">
    <!-- acceuil -->
   <Acceuil />

    
    <!-- video -->
    <div class="addVideo">
      <img :src="stellarYellow" alt="stellarYellow" class="iconYellow" />
      <video ref="videoRef" class="video" muted playsinline>
        <source src="./assets/addVideo.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la vidéo.
      </video>
    </div>
  </div>
</template>

<style scoped>
/* Grand div qui contient tous les éléments */
.bigContainer {
  width: 100%; /* Prend toute la largeur */
  background-color: #f5f5f5; /* Fond gris clair (facultatif) */
}


/* Conteneur de la vidéo (même taille que screen) */
.video
{
  width: 100%;
  height: 100%;
  object-fit: cover; /* Remplit le div sans déformation */
}
.addVideo
{
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.video
{
  width: 100%;
  height: 100%;
  object-fit: cover; /* Remplit le div sans déformation */
}
.iconYellow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60vw;  /* Très grand */
  height: auto; /* Garde les proportions */
  z-index: 2; /* S'assure qu'il est au-dessus de la vidéo */
  opacity: 1.0; /* Légèrement visible sur la vidéo */
}



</style>
