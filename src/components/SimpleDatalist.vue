<template>
  <div class="datalist-wrapper" :class="{ error: error }"
      v-click-outside="handleClickOutside"
      ref="datalistWrapper"
      @resize="onResize">
    <input type="text" v-model="inputText"
           class="input-field" :placeholder="props.placeholder"
           @focusin="focusin" @click="focusin">
    <ul class="datalist-dropdown"
        :class="{ active: showDropdown }">
      <li class="datalist-item"
          v-for="(val, idx) in sortedOptions"
          :key="idx">
        <button class="datalist-option"
                @click="chooseOption(idx)"
                :class="{ focused: idx === currentOption }"
                tabindex="-1"
                ref="buttons">
          <p class="datalist-text">
            {{ val.label }}
          </p>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
  /**
   * Datalist - input with the dropdown
   *
   * The following CSS variables alter the appearance of the component:
   *   - `--datalist-color`
   *   - `--datalist-placeholder-color`
   *   - `--datalist-bg-color`
   *   - `--datalist-hover-bg-color`
   *   - `--datalist-item-hover-bg-color`
   *   - `--datalist-focus-outline-color`
   *   - `--datalist-error-outline-color`
   *   - `--datalist-border-color`
   *   - `--datalist-dropdown-bg-color`
   *   - `--datalist-dropdown-max-height`
   */
  const props = defineProps({
    modelValue: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: 'datalist input'
    },
    options: {
      type: Array,
      required: true
    },
    allowOther: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['update:modelValue']);

  import { computed, onMounted, ref, watch } from 'vue';
  import levenshteinDistance from '../utils/levenshteinDistance';

  const inputText = ref('');
  const currentVal = ref(undefined);

  const sortedOptions = computed(() => {
    if (inputText.value === null) {
      return [];
    }

    const length = props.options.length;
    const options = [];
    for (let i = 0; i < length; ++i) {
      const opt = props.options[i];
      const dist = levenshteinDistance(inputText.value, opt.label);
      if (dist < opt.label.length) {
        options.push({ ...opt, dist });
      }
    }

    options.sort((a, b) => a.dist - b.dist);
    return options;
  });

  const activeOption = computed(() => {
    if (props.modelValue !== undefined) {
      for (const opt of props.options) {
        if (opt.value === props.modelValue) {
          return opt;
        }
      }
    }
    return null;
  });

  const focused = ref(false);
  const showDropdown = computed(() => {
    return inputText.value?.length !== 0 && focused.value &&
      activeOption.value?.label !== inputText.value &&
      sortedOptions.value.length > 0;
  });
  const error = ref(false);

  function focusin() {
    focused.value = true;
    error.value = false;
  }

  function focusout() {
    focused.value = false;
  }

  function chooseOption(idx) {
    const opt = sortedOptions.value[idx];
    if (opt) {
      inputText.value = opt.label;
      currentVal.value = opt.value;
      emit('update:modelValue', opt.value);
      return true;
    }
    return false;
  }

  watch(() => props.modelValue, (newVal) => {
    if (newVal !== currentVal.value) {
      const opt = props.options.find((opt) => opt.value === newVal);
      if (opt) {
        inputText.value = opt.label;
        currentVal.value = opt.value;
      }
    }
  }, { immediate: true });

  const buttons = ref([]);
  const currentOption = ref(undefined);
  watch(showDropdown, () => currentOption.value = undefined);

  function keydownListener(event) {
    if (!showDropdown.value) {
      return;
    }

    const key = event.key;
    const lastOptionIdx = sortedOptions.value.length - 1;

    if (key === 'ArrowDown') {
      if (currentOption.value === undefined) {
        currentOption.value = 0;
      } else if (currentOption.value < lastOptionIdx) {
        currentOption.value++;
      }
    } else if (key === 'ArrowUp') {
      if (currentOption.value === undefined) {
        currentOption.value = 0;
      } else if (currentOption.value > 0) {
        currentOption.value--;
      }
    } else if (key === 'Enter') {
      const success = chooseOption(currentOption.value);
      emit('update:modelValue', null);
      error.value = !success;
      focusout();
    }
  }

  function handleClickOutside() {
    const opt = sortedOptions.value.find(
      (opt) => opt.label === inputText.value);
    if (opt) {
      emit('update:modelValue', opt.value);
    } else {
      emit('update:modelValue', null);
      error.value = true;
    }
    focusout();
  }

  const datalistWrapper = ref(null);
  const dropdownWidth = ref(0);

  function onResize() {
    dropdownWidth.value = datalistWrapper.value?.offsetWidth;
  }

  const resizeObserver = new ResizeObserver(onResize)

  onMounted(() => {
    onResize();
    resizeObserver.observe(datalistWrapper.value);
    document.addEventListener('keydown', keydownListener);
  })
</script>

<style scoped>
.datalist-wrapper {
  ---datalist-color: var(--datalist-color, #000);
  ---datalist-placeholder-color: var(--datalist-placeholder-color, #888);
  ---datalist-bg-color: var(--datalist-bg-color, #fff);
  ---datalist-hover-bg-color: var(--datalist-hover-bg-color, #c7f1d9);
  ---datalist-item-hover-bg-color: var(--datalist-item-hover-bg-color,
    #2ecc7144);
  ---datalist-focus-outline-color: var(--datalist-focus-outline-color, #2ecc71);
  ---datalist-error-outline-color: var(--datalist-error-outline-color, red);
  ---datalist-border-color: var(--datalist-border-color, #c8c8c8);
  ---datalist-dropdown-bg-color: var(--datalist-dropdown-bg-color, #ededed);
  ---datalist-dropdown-max-height: var(--datalist-dropdown-max-height, auto);

  position: relative;
  color: var(---datalist-color);
  background-color: var(---datalist-bg-color);
  padding: 0 0.5em;
  border: 0.06em solid var(---datalist-border-color);
  border-radius: 0.3em;
  transition: border 0.2s ease-in-out;
}

.datalist-wrapper:hover,
.datalist-wrapper:focus-within {
  border: 0.1em solid var(---datalist-focus-outline-color);
}

.datalist-wrapper.error {
  border: 0.1em solid var(---datalist-error-outline-color);
}

.input-field {
  padding: 0.5em 0;
  margin: 0;
  border: none;
  outline: none;
  background-color: var(---datalist-bg-color);
}

.input-field::placeholder {
  color: var(---datalist-placeholder-color);
  background-color: var(---datalist-bg-color);
}

.datalist-dropdown {
  position: absolute;
  z-index: 1;
  top: calc(100% + 0.5em);
  left: 0;
  width: calc(v-bind('dropdownWidth') * 1px);
  max-height: var(---datalist-dropdown-max-height);
  padding: 0.3em;
  border-radius: 0.3em;
  background-color: var(---datalist-dropdown-bg-color);
  list-style: none;
  overflow-y: auto;
  pointer-events: none;
  opacity: 0;
  transition: all 0.3s;
}

.datalist-dropdown.active {
  opacity: 1;
  pointer-events: all;
}

.datalist-item + .datalist-item {
  margin-top: 0.3em;
}

.datalist-option {
  min-width: 100%;
  width: max-content;
  max-width: 100%;
  padding: 0.4em;
  border-radius: 0.3em;
  text-align: start;
  outline: 0.06em solid transparent;
  transition: all 0.2s ease-in-out;
}

.datalist-option:hover {
  background-color: var(---datalist-item-hover-bg-color);
}

.datalist-option.focused {
  outline: 0.06em solid var(---datalist-focus-outline-color);
}

.hello {}
</style>
