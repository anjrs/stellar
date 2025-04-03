<script setup>
const velo = "/assets/velo.png"; // Corrige le chemin
</script>

<template>
    <div class="container">
        <div class="text">
            <div class="text-content">
                <h1 class="title">LEGER MAIS INDESTRUCTIBLE</h1>
                <p class="description">Avec un cadre en fibre de carbone et des renforts en titane et aluminium forgé, le STELLAR X allie légèreté extrême (seulement 5 kg) et résistance absolue. Son design innovant repousse les limites de la maniabilité et de la durabilité.</p>
            </div>

            <div class="text-content">
                <h1 class="title">VITESSE ET CONTROLE ABSOLUE</h1>
                <p class="description">Grâce à sa transmission électronique 12 vitesses et son amortisseur pneumatique ajustable, chaque terrain devient un terrain de jeu. Ajoute à cela des freins hydrauliques haute précision et des pneus tubeless, et tu obtiens un vélo 15% plus rapide, avec un confort et une stabilité inégalés.</p>
            </div>
        </div>

        <div class="image">
            <img :src="velo" alt="Vélo" class="image-velo" />
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
    justify-content: space-between;
    padding: 5vw;
}

/* Section texte */
.text {
    width: 55%;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2rem; /* Espace entre les blocs de texte */
}

.text-content {
    max-width: 80%;
}

.title {
    font-size: 2vw;
    font-weight: bold;
}

.description {
    font-size: 1.2vw;
    line-height: 1.5;
}

/* Section image */
.image {
    width: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.image-velo {
    width: 80%; /* L'image prend toute la largeur du conteneur */
    height: auto;
    animation: moveRight 3s linear infinite alternate; /* Animation */
}

</style>
