<script>
import Champ from '../components/Champ.vue';
import Bouton from '../components/Bouton.vue';
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'Inscription',
    components: {
        Champ,
        Bouton
    },
    setup() {
        const stellarWhite = ref("/assets/stellarWhite.svg");
        const router = useRouter();

        const name = ref('');
        const email = ref('');
        const phone = ref('');

        const submitForm = async () => {
            if (!name.value || !email.value || !phone.value) {
                alert('Veuillez remplir tous les champs.');
                return;
            }
            console.log('Bouton cliqué');
            const data = {
                name: name.value,
                client: 1,
                status: 1,
                email: email.value,
                phone_pro: phone.value
            };

            console.log('Données envoyées :', data);

            try {
                const response = await axios.post('http://localhost:7979/dolibarr/htdocs/api/index.php/thirdparties', data, {
                    headers: {
                        'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Données envoyées avec succès :', response.data);
                alert('Inscription réussie !');
                router.push('/produits');
            } catch (error) {
                if (error.response) {
                    console.error('Erreur lors de l\'envoi des données :', error.response.data);
                    alert(`Erreur : ${error.response.data.error || 'Une erreur est survenue.'}`);
                } else if (error.request) {
                    console.error('Aucune réponse reçue :', error.request);
                    alert('Le serveur ne répond pas.');
                } else {
                    console.error('Erreur :', error.message);
                    alert('Une erreur est survenue lors de la configuration de la requête.');
                }
            }
        };

        return {
            stellarWhite,
            name,
            email,
            phone,
            submitForm
        };
    }
};
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
                    type="text" 
                    placeholder="Entrez votre nom" 
                    v-model="name" 
                />
                <Champ 
                    label="E-mail" 
                    type="email"
                    placeholder="Entrez votre adresse e-mail" 
                    v-model="email" 
                />
                <Champ 
                    type="text"
                    label="Contact" 
                    placeholder="Contact" 
                    v-model="phone" 
                />
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
    position: relative;
}

.logo {
    width: 40%;
}

.icon {
    height: 15%;
    max-height: 80%;
    width: auto;
    position: absolute;
    top: 2;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
}
</style>