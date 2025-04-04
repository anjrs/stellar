<script setup>
defineProps({
  label: String, // Texte du label
  type: {
    type: String,
    default: "text" // Type par défaut : texte
  },
  placeholder: String // Texte indicatif dans le champ
});
</script>

<template>
    <div class="custom-field">
      <label v-if="label" class="field-label">{{ label }}</label>
      <input 
        :type="type" 
        :placeholder="placeholder"
        class="custom-input" 
      />
    </div>
  </template>

<style scoped>
@font-face {
  font-family: "AktivGrotesk-Regular";
  src: url("/assets/fonts/AktivGrotesk-Regular.otf") format("opentype");
}

.custom-field
{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.field-label
{
  font-family: "AktivGrotesk-Regular", sans-serif;
  font-size: 18px;
  color: #B1FF36;
}

.custom-input
{
  font-family: "AktivGrotesk-Regular", sans-serif;
  font-size: 18px;
  color: #B1FF36;
  background-color: transparent;
  border: 3px solid #B1FF36;
  border-radius: 60px;
  padding: 15px 20px;
  width: 100%;
  outline: none;
  transition: all 0.3s ease;
}

.custom-input::placeholder
{
  color: rgba(177, 255, 54, 0.5);
}

.custom-input:focus
{
  border-color: white;
}
</style>