<script setup>
import CheckboxList from './components/CheckboxList.vue'
import { ref } from 'vue';

const mass = ref([
  { id: 1, name: "Name 1" },
  { id: 2, name: "Name 2" },
  { id: 3, name: "Name 3" },
  { id: 4, name: "Name 4" },
  { id: 5, name: "Name 5" },
  { id: 6, name: "Name 6" },
  { id: 7, name: "Name 7" },
  { id: 8, name: "Name 8" },
  { id: 9, name: "Name 9" }
])
const label = ref("Выбор имен")
</script>

<template>
  <CheckboxList 
    :label="label"
    :massProps="mass"
  />
</template>
