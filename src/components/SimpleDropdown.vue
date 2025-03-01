<template>
  <div
    ref="dropdown"
    v-click-outside="close"
    class="dropdown-container"
    @resize="onResize"
  >
    <button
      class="dropdown-button"
      :class="{active: active}"
      @click="toggle"
      ref="dropdownButton"
    >
      <p class="dropdown-text">
        {{ activeItem ? activeItem['label'] : emptyPrompt }}
      </p>
      <div class="dropdown-arrow" />
    </button>
    <ul
      ref="content"
      class="content"
      :class="{ active: active }"
    >
      <li
        v-for="(val, idx) in options"
        :key="idx"
        class="item"
      >
        <button
          class="item-button"
          @click="choose(val['value'])"
          :class="{ active: modelValue === val['value'] }"
          tabindex="-1"
          ref="buttons"
        >
          <p class="dropdown-text">
            {{ val['label'] }}
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
   *   - `--dropdown-color`
   *   - `--dropdown-bg-color`
   *   - `--dropdown-list-color`
   *   - `--dropdown-list-bg-color`
   *   - `--dropdown-hover-bg-color`
   *   - `--dropdown-item-hover-bg-color`
   *   - `--dropdown-active-color`
   *   - `--dropdown-active-bg-color`
   *   - `--dropdown-focus-outline-color`
   *   - `--dropdown-max-height`
   */
  const props = defineProps({
    modelValue: {
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    emptyPrompt: {
      type: String,
      default: ''
    }
  });

  import { ref, computed, onMounted, onUpdated } from 'vue';

  const active = ref(false);

  const emit = defineEmits(['update:modelValue']);

  const dropdownButton = ref(null);
  const buttons = ref([]);

  function toggle() {
    active.value = !active.value;

    if (active.value) {
      buttons.value.forEach((el) => {
        el.tabIndex = 0;
      });
    } else {
      buttons.value.forEach((el) => {
        el.tabIndex = -1;
      })
      dropdownButton.value.focus();
    }
  }

  function close() {
    active.value = false;
  }

  function choose(val) {
    emit('update:modelValue', val);
    toggle();
  }

  const activeItem = computed(() => {
    for (const i of props.options) {
      if (i['value'] === props.modelValue) {
        return i;
      }
    }
  });

  const dropdown = ref(null);
  const content = ref(null);
  const width = ref(0);

  function onResize() {
    width.value = dropdown.value?.offsetWidth;
  }

  const resizeObserver = new ResizeObserver(onResize);

  onMounted(() => {
    width.value = dropdown.value.offsetWidth;
    resizeObserver.observe(dropdown.value);

    document.addEventListener('keydown', (ev) => {
      if (active.value && ev.key === 'Escape')
        toggle();
    });
  });

  onUpdated(() => {
    if (active.value)
      content.value.scrollTo(1, 0);
  });

</script>

<style scoped>
.dropdown-container {
  ---dropdown-color: var(--dropdown-color, #000);
  ---dropdown-bg-color: var(--dropdown-bg-color, #ededed);
  ---dropdown-list-color: var(--dropdown-list-color, var(---dropdown-color));
  ---dropdown-list-bg-color: var(--dropdown-list-bg-color,
    var(---dropdown-bg-color));
  ---dropdown-hover-bg-color: var(--dropdown-hover-bg-color, #2ecc7144);
  ---dropdown-item-hover-bg-color: var(--dropdown-item-hover-bg-color,
    var(---dropdown-hover-bg-color));
  ---dropdown-active-color: var(--dropdown-active-color,
    var(---dropdown-color));
  ---dropdown-active-bg-color: var(--dropdown-active-bg-color, #2ecc71);
  ---dropdown-focus-outline-color: var(--dropdown-focus-outline-color,
    var(---dropdown-active-bg-color));
  ---dropdown-max-height: var(--dropdown-max-height, auto);

  position: relative;
  color: var(---dropdown-color);
}

.dropdown-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0 0.8em;
  width: 100%;
  padding: 0.7em;
  background-color: var(---dropdown-bg-color);
  border-radius: 0.3em;
  outline: 0.0625em solid transparent;
  transition: all 0.2s ease-in-out, outline 0.1s;
}

.dropdown-button:hover {
  background-color: var(---dropdown-hover-bg-color);
}

.dropdown-button:focus {
  outline: 0.0625em solid var(---dropdown-focus-outline-color);
}

.dropdown-text {
  text-align: start;
}

.dropdown-arrow {
  width: 0.4em;
  aspect-ratio: 1 / 1;
  border-color: var(---dropdown-color);
  border-style: solid;
  border-width: 0.15em 0 0 0.15em;
  transform-origin: 0.15em 0.15em;
  transform: rotate(-45deg);
  transition: 0.3s;
}

.dropdown-button.active .dropdown-arrow {
  transform: rotate(-135deg);
}

.content {
  position: absolute;
  z-index: 1;
  top: calc(100% + 0.5em);
  width: calc(v-bind('width') * 1px);
  max-height: var(---dropdown-max-height);
  padding: 0.3em;
  border-radius: 0.3em;
  color: var(---dropdown-list-color);
  background-color: var(---dropdown-list-bg-color);
  list-style: none;
  overflow-y: auto;
  pointer-events: none;
  transition: 0.3s;
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
  transition: all 0.2s ease-in-out;
  outline: 0.06em solid transparent;
}

.item-button:hover {
  background-color: var(---dropdown-item-hover-bg-color);
}

.item-button:focus {
  outline-color: var(---dropdown-focus-outline-color);
}

.dropdown-button.active,
.item-button.active {
  background-color: var(---dropdown-active-bg-color);
  color: var(---dropdown-active-color);
}

.content.active {
  opacity: 1;
  pointer-events: all;
}

</style>
