<script>
import starBlack from '../assets/starBlack.svg';
import stellarBlack from '../assets/stellarBlack.svg';
</script>

<template>
    <div class="home">
      <div class="header">
        <img :src="starBlack" alt="star" class="icon" />
        <img :src="stellarBlack" alt="stellarBlack" class="icon" />
      </div>
      <div class="imageEclair">
      </div>
    </div>
</template>

<style scoped>
    
    .header
    {
    width: 100%;
    height: 20vh; /* 30% de la hauteur de l'écran */
    display: flex;
    justify-content: center; /* Centre horizontalement */
    align-items: center; /* Centre verticalement */
    gap: 20px; /* Espace entre les SVG */
    }
    /* Div qui prend toute la largeur et toute la hauteur de l'écran */
    .home
    {
    width: 100vw; /* 100% de la largeur de l'écran */
    height: 100vh; /* 100% de la hauteur de l'écran */
    background-color: white; 
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column; 
    }


    /* Div avec une image en arrière-plan qui prend 70% de l'écran */
    .imageEclair {
    width: 100%; /* Prend toute la largeur */
    height: 80%; /* Prend 70% de la hauteur de .screen */
    background-image: url('../assets/eclair.png'); /* Remplace par ton image */
    background-size: cover; /* Couvre tout le div */
    background-position: center; /* Centre l'image */
    }

    /* Style des icônes */
    .icon
    {
    width: auto;
    height: 80%; /* Remplit presque tout l’espace */
    max-height: 100%; /* Ne dépasse pas emptySpace */
    flex-shrink: 0; /* Évite que les icônes se réduisent trop */
    }
</style>