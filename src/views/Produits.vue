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
                    Smartphone XYZ
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
    background-color: black;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start; /* Pour que le header reste en haut */
}
</style>