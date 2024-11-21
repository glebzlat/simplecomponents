<template>
  <div class="dropdown-container" v-click-outside="close" ref="dropdown"
      @resize="onResize">
    <button class="dropdown-button" @click="toggle" :class="{active: active}">
      <p class="dropdown-text">
        {{ options[modelValue] }}
      </p>
      <div class="dropdown-arrow"></div>
    </button>
    <ul class="content" :class="{ active: active }">
      <li class="item" v-for="(val, idx) in options" :key="idx">
        <button class="item-button" @click="choose(idx)">
          <p class="dropdown-text">
            {{ val }}
          </p>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
  const props = defineProps({
    modelValue: {
      required: true
    },
    options: {
      type: Array
    }
  });

  import { ref, onMounted } from 'vue';

  const active = ref(false);

  const emit = defineEmits(['update:modelValue']);

  function toggle() {
    active.value = !active.value;
  }

  function close() {
    active.value = false;
  }

  function choose(idx) {
    emit('update:modelValue', idx);
    toggle();
  }

  const dropdown = ref(null);
  const content = ref(null);
  const width = ref(0);

  function onResize() {
    width.value = dropdown.value.offsetWidth;
  }

  const resizeObserver = new ResizeObserver(onResize);

  onMounted(() => {
    width.value = dropdown.value.offsetWidth;
    console.log(JSON.stringify(dropdown.value))
    resizeObserver.observe(dropdown.value)
  })

</script>

<style scoped>
.dropdown-container {
  position: relative;
  font-size: var(--dropdown-font-size);
}

.dropdown-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0 0.8em;
  width: 100%;
  padding: 0.7em;
  background-color: var(--dropdown-bg-color);
  border-radius: 0.3em;
  transition: background-color 0.2s ease-in-out;
}

.dropdown-button:hover {
  background-color: var(--dropdown-hover-bg-color);
}

.dropdown-text {
  text-align: start;
}

.dropdown-arrow {
  width: 0.4em;
  aspect-ratio: 1 / 1;
  border-color: var(--dropdown-color);
  border-style: solid;
  border-width: 0.15em 0 0 0.15em;
  transform-origin: 0.15em 0.15em;
  transform: rotate(-45deg);
  transition: 0.5s;
}

.dropdown-button.active .dropdown-arrow {
  transform: rotate(-135deg);
}

.content {
  position: absolute;
  z-index: 1;
  top: calc(100% + 0.5em);
  width: calc(v-bind('width') * 1px);
  padding: 0.3em;
  border-radius: 0.3em;
  background-color: var(--dropdown-content-bg-color);
  list-style: none;
  pointer-events: none;
  transition: 0.5s;
  opacity: 0;
}

.item + .item {
  margin-top: 0.3em;
}

.item-button {
  min-width: 100%;
  width: max-content;
  max-width: 100%;
  padding: 0.4em;
  border-radius: 0.3em;
  transition: background-color 0.2s ease-in-out;
}

.item-button:hover {
  background-color: var(--dropdown-item-hover-bg-color);
}

.content.active {
  opacity: 1;
  pointer-events: all;
}

</style>
