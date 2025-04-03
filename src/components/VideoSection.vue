<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Utilisation du chemin direct pour l'image
const stellarYellow = "/assets/stellarYellow.svg";
const videoRef = ref(null);

const handleScroll = () => {
  if (!videoRef.value) return;

  const rect = videoRef.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  requestAnimationFrame(() => {
    if (rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3) {
      videoRef.value.play();
    } else {
      videoRef.value.pause();
    }
  });
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
  <div class="addVideo">
    <img :src="stellarYellow" alt="stellarYellow" class="iconYellow" />
    <video ref="videoRef" class="video" muted playsinline>
      <source src="/assets/addVideo.mp4" type="video/mp4" />
      Votre navigateur ne supporte pas la vidéo.
    </video>
  </div>
</template>

<style scoped>
/* Conteneur principal */
.addVideo {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

/* Vidéo en plein écran */
.video {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Remplit le div sans déformation */
}

/* Icône centrée et grande */
.iconYellow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60vw; /* Très grand */
  height: auto; /* Garde les proportions */
  z-index: 2; /* S'assure qu'il est au-dessus de la vidéo */
  opacity: 1.0; /* Complètement visible */
}
</style>
