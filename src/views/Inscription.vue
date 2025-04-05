<script>
import Champ from '../components/Champ.vue'
import Bouton from '../components/Bouton.vue'
import axios from 'axios'
import { ref } from 'vue'


export default
{
    name: 'Inscription',
    components:
    {
        Champ,
        Bouton
    },
    setup()
    {
        const stellarWhite = ref("/assets/stellarWhite.svg");
        const name = ref('');
        const email = ref('');
        const phone = ref('');

        const submitForm = async () => 
        {
            console.log('Bouton cliqué');
            try {
                const response = await axios.post('http://localhost:7979/dolibarr/htdocs/api/index.php/thirdparties',
                {
                    name: name.value,
                    email: email.value,
                    phone: phone.value,
                    client: 1,
                },
                {
                    headers:
                    {
                        'method': 'POST',
                        'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8', // Remplacez par votre clé API Dolibarr
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Données envoyées avec succès :', response.data);
                alert('Inscription réussie !');
                router.push('/produits');
            }
            catch (error)
            {
                console.error('Erreur lors de l\'envoi des données :', error);
                alert('Une erreur est survenue lors de l\'inscription.');
            }
        };
        return {
            stellarWhite,
            name,
            email,
            phone,
            // client,
            submitForm
        };
        
    }
}
</script>

<template>
    <div class="container">
        <div class="formulaire">
            <div class="logo">
                <img :src="stellarWhite" alt="star" class="icon" />
            </div>

            <div class="champs">
                <Champ 
                    label="Nom" 
                    placeholder="Entrez votre nom" 
                    name="name" 
                    v-model="name" 
                />
                <Champ 
                    label="E-mail" 
                    placeholder="Entrez votre adresse e-mail" 
                    name="email" 
                    v-model="email" 
                />
                <Champ 
                    label="Contact" 
                    placeholder="Contact" 
                    name="phone" 
                    v-model="phone" 
                />
                <!-- <Champ 
                    label="Mot de passe" 
                    type="password" 
                    placeholder="Entrez votre mot de passe" 
                /> -->
                <Bouton class="custom-button" @click="submitForm">
                    S INSCRIRE
                </Bouton>
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
</style>