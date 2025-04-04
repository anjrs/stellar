<script scoped>
import Header from '../components/Header.vue'
import CarteProduit from '../components/CarteProduit.vue';


export default
{
    name: 'Produits',
    components:
    {
        Header,
        CarteProduit
    }
}
</script>

<template>
    <Header />

    <div class="container">
        <div class="carteContainer">
            <CarteProduit :imageSrc="'/assets/produit1.jpg'">
                <template #categorie>
                    Électronique
                </template>
                <template #nom>
                    SMARTPHONE XYZ
                </template>
                <template #prix>
                    20000 Ariary
                </template>
            </CarteProduit>

            <CarteProduit :imageSrc="'/assets/produit1.jpg'">
                <template #categorie>
                    Électronique
                </template>
                <template #nom>
                    SMARTPHONE XYZ
                </template>
                <template #prix>
                    20000 Ariary
                </template>
            </CarteProduit>

            <CarteProduit :imageSrc="'/assets/produit1.jpg'">
                <template #categorie>
                    Électronique
                </template>
                <template #nom>
                    SMARTPHONE XYZ
                </template>
                <template #prix>
                    20000 Ariary
                </template>
            </CarteProduit>
        </div>
        
    </div>
</template>

<style scoped>
.container {
    width: 100vw;
    height: 100vh;
    padding-top: 70px; /* Pour éviter que le contenu soit caché par le header */
    background-color: black;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start; /* Pour que le header reste en haut */
}

.carteContainer {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap; /* Permet d'avoir plusieurs cartes sur une ligne */
    justify-content: center; /* Centre les cartes horizontalement */
    gap: 40px; /* Espace entre les cartes */
}
</style>