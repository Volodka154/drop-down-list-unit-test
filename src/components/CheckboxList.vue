<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  massProps: Object,
  label: String
})

const isShowModal = ref(false)
const newMass = ref([])
const selectedAllWatcher = ref(-1)
const isSelectedAll = ref(false)

const changeShowModal = function() {
  isShowModal.value = !isShowModal.value
  if (isShowModal.value) {
    newMass.value.forEach(item => {
      document.getElementById('checkbox-item-' + item.id).classList.add('checkbox-item-active')
    })
  }
}
const selectItem = function(id) {
  let findIt = newMass.value.findIndex(item => item.id === id)
  if (findIt === -1) {
    findIt = props.massProps.findIndex(item => item.id === id)
    newMass.value.push(props.massProps[findIt])
    document.getElementById('checkbox-item-' + id).classList.add('checkbox-item-active')
  }
  else {
    newMass.value.splice(findIt, 1)
    document.getElementById('checkbox-item-' + id).classList.remove('checkbox-item-active')
  }
}
const selectAll = function() {
  // отключаем нажатие при работе анимации
  document.getElementById('select-all').disabled = true
  selectedAllWatcher.value = 0
  if (props.massProps.length !== newMass.value.length) {
    isSelectedAll.value = true
    // перезапишем newMass
    newMass.value = []
    props.massProps.forEach(item => newMass.value.push(item))
  }
  else {
    isSelectedAll.value = false
    newMass.value = []
  }
}

watch(selectedAllWatcher, () => {
  // время анимации одой строки
  const ms = 25
  // условие для заполнения всех строк
  if (selectedAllWatcher.value < props.massProps.length) {
    // количество видимых анимированных строк (нет смысла анимировать строки, которые не будет видно)
    if (selectedAllWatcher.value < 5) {
      setTimeout(() => {
        isSelectedAll.value
          ? document.getElementById('checkbox-item-' + props.massProps[selectedAllWatcher.value].id).classList.add('checkbox-item-active')
          : document.getElementById('checkbox-item-' + props.massProps[selectedAllWatcher.value].id).classList.remove('checkbox-item-active')
        selectedAllWatcher.value++
      }, ms)
    } else {
      isSelectedAll.value
        ? document.getElementById('checkbox-item-' + props.massProps[selectedAllWatcher.value].id).classList.add('checkbox-item-active')
        : document.getElementById('checkbox-item-' + props.massProps[selectedAllWatcher.value].id).classList.remove('checkbox-item-active')
      selectedAllWatcher.value++
    }
  }
  // когда заканчивается анимация разешаем нажимать
  if (selectedAllWatcher.value === props.massProps.length) {
    document.getElementById('select-all').disabled = false
  }
})
</script>

<template>
<div class="checkbox">
  <div class="checkbox-main" @click="changeShowModal">
    <label style="overflow: hidden;">{{ props.label }}</label>
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
  <Transition name="fade">
    <div
      v-show="isShowModal" 
      class="checkbox-content"
    >
      <option
        id="select-all"
        @click="selectAll"
        class="checkbox-item checkbox-item__select-all"
      >
        Выбрать все
      </option>
      <option
        v-for="item in props.massProps"
        :key="item.id"
        :id="'checkbox-item-' + item.id"
        class="checkbox-item"
        @click="selectItem(item.id)"
      >
        {{ item.name }}
      </option>
    </div>
  </Transition>
  <p v-if="newMass.length" style="position: absolute; top: 10px;">Выбрано - {{ newMass }}</p>
</div>
</template>
<style scoped>
.checkbox {
  text-align: left;
}
.checkbox-main {
  display: flex;
  justify-content: space-between;
  border: 1px solid whitesmoke;
  padding: 0px 5px;
  width: 200px;
  transition: all 0.2s ease-in-out;
  gap: 5px;
}
.checkbox-main:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.checkbox-main:active {
  background-color: rgba(255, 255, 255, 0.3);
}

.checkbox-content {
  position: absolute;
  margin-top: 5px;
  border: 1px solid whitesmoke;
  padding: 0px 5px;
  width: 200px;
  max-height: 160px;
  overflow-y: scroll;
}

.checkbox-item {
  border-bottom: 1px solid whitesmoke;
  transition: all 0.2s;
}
.checkbox-item:last-child {
  border-bottom: 0px;
}
.checkbox-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.checkbox-item:active {
  background-color: rgba(255, 255, 255, 0.3);
}
.checkbox-item-active {
  color: #242424;
  border-bottom: 1px solid #242424;
  background-color: rgba(255, 255, 255, 0.5);
}
.checkbox-item-active:hover {
  background-color: rgba(255, 255, 255, 0.6);
}
.checkbox-item__select-all {
  border-bottom: 2px solid rgb(100, 100, 100);
  color: rgb(150, 150, 150);
}

.icon-arrow {
  color: white;
  height: 24px;
  width: 24px;
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