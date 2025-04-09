<script>
import Bouton from './Bouton.vue';
import Note from './Note.vue';
import axios from 'axios';

export default {
  name: 'CarteProduit',
  components: {
    Bouton,
    Note
  },
  props: {
    produit: {
      type: Object,
      required: true
    },
    image: {
      type: String,
      default: '/assets/produit1.jpg'
    }
  },
  data() {
    return {
      noteMoyenne: '0.0'
    };
  },
  mounted() {
    this.calculerNoteMoyenne();
  },
  watch: {
    'produit.array_options.options_note': {
      handler() {
        this.calculerNoteMoyenne();
      }
    }
  },
  methods: {
    // Méthodes liées aux notes
    calculerNoteMoyenne() {
      if (!this.produit.array_options?.options_note) {
        this.noteMoyenne = '0.0';
        return;
      }

      // Récupérer les notes sous forme de chaîne de caractères, puis les convertir en tableau de nombres
      const notes = this.produit.array_options.options_note
        .split(',')
        .map(Number);

      // Calculer la somme des notes
      const somme = notes.reduce((acc, note) => acc + note, 0);
      this.noteMoyenne = (somme / notes.length).toFixed(1);
    },
    handleRate({ produit, note }) {
      const ancienne = produit.array_options.options_note || '';
      produit.array_options.options_note = ancienne ? `${ancienne},${note}` : `${note}`;
      
      // La note moyenne sera mise à jour automatiquement par le watcher
      
      // Émettre un événement pour que le composant parent puisse gérer la mise à jour de la note
      this.$emit('update-note', { produit: this.produit , note}),
      console.log(`Produit:  ${produit.ref}, Note ajoutée : ${note}, Nouvelle moyenne : ${this.noteMoyenne}`);

      },
       // Méthodes liées au panier
    ajouterAuPanier() {
    console.log('Produit ajouté au panier :', this.produit);
    this.$emit('ajouter', this.produit); // Émet l'objet produit

    },
    
   
  }
};

</script>

<template>
  <div class="carte">
    <!-- Section photo produit -->
    <div class="photoProduit">
      <img :src="produit.image || image" alt="Photo du produit" class="image" />
      <div class="categorie">
        <slot name="categorie">Catégorie</slot>
      </div>
    </div>

    <!-- Section détails et actions -->
    <div class="other">
      <!-- Informations produit -->
      <div class="detail">
        <span class="nom">
          <slot name="nom">{{ produit.nom || 'Nom du produit' }}</slot>
        </span>
        <span class="prix">
          Prix HT : {{ produit.price }}
        </span>
      </div>

      <!-- Système de notation -->
      <!-- <Note :produit="produit" @rate="handleRate" /> -->

      <!-- Actions sur le produit -->
      <div class="boutons">
        <!-- <button class="custom-button" @click="$emit('moins', produit)">ACHETER</button> -->
        <Bouton class="custom-button" @click="ajouterAuPanier">
          AJOUTER
        </Bouton>
        <!-- <button class="custom-button" @click="() => console.log('Bouton AJOUTER cliqué')">AJOUTER</button> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.carte {
  width: 300px;
  height: 400px;
  border: 3px solid #B1FF36;
  border-radius: 20px;
  background-color: transparent;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

/* Partie image et catégorie */
.photoProduit {
  position: relative;
  height: 300px;
  width: 100%;
  background-color: transparent;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.categorie {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #B1FF36;
  padding: 5px 15px;
  border-radius: 25px;
  font-family: "AktivGrotesk-Regular", sans-serif;
  font-size: 14px;
  color: black;
  text-transform: uppercase;
}

/* Partie détails et actions */
.other {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-family: "AktivGrotesk-Regular", sans-serif;
}

.nom {
  font-weight: bold;
  color: white;
}

.prix {
  color: #B1FF36;
  font-weight: bold;
}

/* Boutons d'action */
.boutons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.custom-button {
  font-family: "AktivGrotesk-Regular", sans-serif;
  font-size: 16px;
  color: #B1FF36;
  background-color: transparent;
  border: 3px solid #B1FF36;
  border-radius: 30px;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  width: 70%;
  max-width: 130px;
}

.custom-button:hover {
  background-color: #B1FF36;
  color: #000;
}
</style>