<template>
  <div class="dropdown-container" v-click-outside="close" ref="dropdown"
      @resize="onResize">
    <button class="dropdown-button" @click="toggle" :class="{active: active}">
      <p class="dropdown-text">
        {{ options[modelValue] }}
      </p>
      <div class="dropdown-arrow"></div>
    </button>
    <ul class="content" :class="{ active: active }" ref="content">
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
  /**
   * Dropdown
   * @displayName Dropdown
   *
   * Auto resizable dropdown list component. It uses the following CSS
   * variables:
   *   - `--dropdown-font-size`
   *   - `--dropdown-color`
   *   - `--dropdown-bg-color`
   *   - `--dropdown-hover-bg-color`
   *   - `--dropdown-content-bg-color`
   *   - `--dropdown-item-hover-bg-color`
   *   - `--dropdown-max-height`
   */
  const props = defineProps({
    modelValue: {
      required: true
    },
    options: {
      type: Array
    }
  });

  import { ref, onMounted, onUpdated } from 'vue';

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
    width.value = dropdown.value?.offsetWidth;
  }

  const resizeObserver = new ResizeObserver(onResize);

  onMounted(() => {
    width.value = dropdown.value.offsetWidth;
    resizeObserver.observe(dropdown.value)
  });

  onUpdated(() => {
    if (active.value)
      content.value.scrollTo(1, 0);
  });

</script>

<style scoped>
.dropdown-container {
  --dropdown-default-bg-color: #e1e1e1;
  --dropdown-default-fg-color: #000;

  position: relative;
  font-size: var(--dropdown-font-size, inherit);
  color: var(--dropdown-color, #000);
}

.dropdown-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0 0.8em;
  width: 100%;
  padding: 0.7em;
  background-color: var(--dropdown-bg-color, var(--dropdown-default-bg-color));
  border-radius: 0.3em;
  transition: background-color 0.2s ease-in-out;
}

.dropdown-button:hover {
  --dropdown-button-bg-color: var(--dropdown-bg-color,
    var(--dropdown-default-bg-color));
  background-color: var(--dropdown-hover-bg-color,
    var(--dropdown-button-bg-color));
}

.dropdown-text {
  text-align: start;
}

.dropdown-arrow {
  width: 0.4em;
  aspect-ratio: 1 / 1;
  border-color: var(--dropdown-color, var(--dropdown-default-fg-color));
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
  max-height: var(--dropdown-max-height, auto);
  padding: 0.3em;
  border-radius: 0.3em;
  background-color: var(--dropdown-content-bg-color,
    var(--dropdown-default-bg-color));
  list-style: none;
  overflow-y: auto;
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
  background-color: var(--dropdown-item-hover-bg-color,
    var(--dropdown-content-bg-color));
}

.content.active {
  opacity: 1;
  pointer-events: all;
}

</style>
