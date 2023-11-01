<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  massProps: Object,
  label: String
})
const emit = defineEmits(['update:massProps'])

const isShowModal = ref(false)
const newMass = ref([])
const isSelectedAll = ref(false)

const changeShowModal = function() {
  isShowModal.value = !isShowModal.value
}
const selectAll = function() {
  if (props.massProps.length !== newMass.value.length) {
    newMass.value = []
    props.massProps.forEach(item => newMass.value.push(item))
  }
  else {
    newMass.value = []
  }
}

const setLabel = computed(() => {
  if (newMass.value.length) {
    return newMass.value.reduce((cur, item) => cur += item.name + ";", "")
  }
  return props.label
})

watch(newMass, () => {
  isSelectedAll.value = (newMass.value.length === props.massProps.length)
})
watch(isShowModal, function() {
  if (!isShowModal.value) {
    console.log("Данные отправляются в момент закрытия списка")
    emit('update:massProps', newMass)
  }
})
</script>

<template>
<div>
  <div class="checkbox">
    <div class="checkbox-main" @click="changeShowModal">
      <label class="checkbox-main__label">{{ setLabel }}</label>
      <svg 
        class="icon-arrow" 
        :class="{'rotation-180deg' : !isShowModal}"
        xmlns="http://www.w3.org/2000/svg" 
        xmlns:xlink="http://www.w3.org/1999/xlink" 
        viewBox="0 0 24 24"
      >
        <path d="M7 10l5 5l5-5H7z" fill="currentColor"></path>
      </svg>  
    </div>
    <label 
      class="checkbox-main__all" 
    >
      <input 
        type="checkbox"
        :checked="isSelectedAll"
        @change="selectAll"
      >
      Все
    </label>
    <Transition name="fade">
      <div
        v-show="isShowModal" 
        class="checkbox-content"
      >
        <label
          v-for="item in props.massProps"
          :key="item.id"
          class="checkbox-item"
        >
          <input :value="item" v-model="newMass" type="checkbox">
          {{ item.name }}
        </label>
      </div>
    </Transition>
  </div>
</div>
</template>
<style scoped>
.checkbox {
  display: flex;
  text-align: left;
  gap: 5px;
  width: auto;
}
.checkbox-main {
  display: flex;
  justify-content: space-between;
  border: 1px solid whitesmoke;
  padding: 0px 5px;
  transition: all 0.2s ease-in-out;
  max-width: 250px;
  gap: 5px;
}
.checkbox-main:hover {
  background-color: rgb(50, 50, 50);
}
.checkbox-main:active {
  background-color: rgba(80, 80, 80)}
.checkbox-main__label {
  white-space: nowrap;
  overflow: hidden;
}
.checkbox-main__all {
  white-space: nowrap;
}
.checkbox-content {
  position: absolute;
  margin-top: 30px;
  padding: 0px 5px;
  width: 200px;
  max-height: 160px;
  overflow-y: scroll;
  border: 1px solid whitesmoke;
  display: flex;
  flex-direction: column;
}

.checkbox-item {
  border-bottom: 1px solid whitesmoke;
  transition: all 0.2s;
}
.checkbox-item:last-child {
  border-bottom: 0px;
}
.checkbox-item:hover {
  background-color: rgb(50, 50, 50);
}
.checkbox-item:active {
  background-color: rgb(80, 80, 80);
}
.icon-arrow {
  color: white;
  height: 24px;
  min-width: 24px;
  transition: all 0.2s ease-in-out;
}
.rotation-180deg {
  rotate: 180deg;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>