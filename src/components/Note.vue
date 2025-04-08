<template>
  <div class="note">
    <span v-for="n in 5" :key="n" class="etoile" @click="noter(n)">
      ★
    </span>
  </div>
</template>

<script>
export default {
  name: 'Note',
  props: {
    produit: {
      type: Object,
      required: true
    }
  },
  methods: {
    noter(note) {
      this.$emit('rate', { produit: this.produit, note });
    }
  }
};
</script>

<style scoped>
.etoile {
  font-size: 24px;
  color: #B1FF36;
  cursor: pointer;
}
</style>
