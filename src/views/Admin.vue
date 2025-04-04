<script>
import Champ from '../components/Champ.vue'
import Bouton from '../components/Bouton.vue'

export default
{
  name: 'Admin',
  components:
  {
    Champ,
    Bouton
  }
}
</script>

<template>
    <div class="container">
        <div class="formulaire">
            <Champ label="Identifiant" placeholder="Entrez votre id" />
            <Champ label="Mot de passe" type="password" placeholder="Entrez votre mot de passe" />
            <Bouton class="custom-button">
                SE CONNECTER
            </Bouton>
        </div>
    </div>
</template>

<style scoped>
.container
{
    width: 100vw;
    height: 100vh;
    background-color: black;
    display: flex;
    align-items: center;
    justify-content: center;
}

.formulaire {
  width: 100%;
  height: 50%; /* Largeur agrandie */
  max-width: 900px; /* Pour éviter qu'il devienne trop large */
  padding: 40px; /* Espacement interne pour plus d'aération */
  border: 3px solid #B1FF36; /* Bordure similaire au bouton */
  border-radius: 60px; /* Arrondi identique */
  background-color: transparent; /* Fond transparent */
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 20px; /* Espace entre les champs */
  margin: 50px auto; /* Centre le formulaire */
}
</style>