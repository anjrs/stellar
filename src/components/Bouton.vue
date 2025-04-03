<template>
    <button class="custom-button">
      <slot></slot>
    </button>
  </template>
  
  <style scoped>
  @font-face {
    font-family: "AktivGrotesk-Regular";
    src: url("/assets/fonts/AktivGrotesk-Regular.otf") format("opentype"); /* Mets le bon chemin */
  }
  
  .custom-button {
  font-family: "AktivGrotesk-Regular", sans-serif;
  font-size: 18px;  /* Augmentation de la taille du texte */
  color: #B1FF36;
  background-color: transparent;
  border: 3px solid #B1FF36;  /* Augmentation de l'épaisseur du bord */
  border-radius: 60px;  /* Augmentation du rayon pour un bord plus arrondi */
  padding: 15px 30px;  /* Augmentation de l'espacement intérieur */
  cursor: pointer;
  display: flex;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
}

  
  .custom-button:hover {
    background-color: rgba(177, 255, 54, 0.2); /* Effet léger au hover */
  }
  </style>
  