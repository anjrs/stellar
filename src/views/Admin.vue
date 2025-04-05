<script setup>
import Champ from '../components/Champ.vue'
import Bouton from '../components/Bouton.vue'
import { ref } from 'vue'
import router from '../router';

const stellarWhite = ref("/assets/stellarWhite.svg");
</script>

<template>
    <div class="container">
        <div class="formulaire">
            <div class="logo">
                <img :src="stellarWhite" alt="star" class="icon" />
            </div>

            <div class="champs">
                <Champ label="E-mail" placeholder="Entrez votre adresse e-mail" />
                <Champ label="Mot de passe" type="password" placeholder="Entrez votre mot de passe" />
                <Bouton class="custom-button">
                    SE CONNECTER
                </Bouton>
            
                <router-link to="/inscription" class="inscription-link">
                    Pas encore inscrit ? Créez un compte ici !
                </router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 100vw;
    height: 100vh;
    background-color: black;
    display: flex;
    align-items: center;
    justify-content: center;
}

.formulaire {
  width: 100%;
  height: 50%;
  max-width: 900px;
  padding: 40px;
  border: 3px solid #B1FF36;
  border-radius: 60px;
  background-color: transparent;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 50px auto;
  position: relative; /* Assure-toi que le formulaire peut être sous l'image */
}

.logo
{
    width: 40%;
}
.icon {
  height: 15%;  /* Augmentation de la hauteur à 80% */
  max-height: 80%;  /* Limite la hauteur maximale à 80% */
  width: auto;  /* Maintient les proportions de l'image */
  position: absolute; /* Position absolue pour superposer l'image */
  top: 2; /* Positionne l'image en haut du formulaire */
  left: 50%; /* Centrer horizontalement */
  transform: translateX(-50%); /* Ajuste le centrage */
  z-index: 10; /* Placer l'image au-dessus des autres éléments */
}


.champs
{
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 10%;
}
</style>
curl -X GET "http://localhost:7979/dolibarr/api/index.php/products" -H "DOLAPIKEY: 8a8MsnQGo371to4oVLWk552rIhNUFIt8" -H "Accept: application/json"

