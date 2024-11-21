<template>
  <label class="checkbox-container">
    <input type="checkbox" class="checkbox" @click="toggle">
    <div class="checkmark" :class="{ checked: modelValue, frozen: frozen }">
    </div>
    <slot />
  </label>
</template>

<script setup>
  /**
   * Checkbox
   * @displayName Checkbox
   *
   * Checkbox component expects the following CSS variables to be set on
   * parent element:
   *   - `--checkbox-active-color`
   *   - `--checkbox-inactive-color`
   */
  const props = defineProps({
    size: {
      type: [String, Number],
      default: 1
    },
    modelValue: {
      required: true,
      type: Boolean
    },
    frozen: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['update:modelValue']);

  function toggle() {
    if (!props.frozen)
      emit('update:modelValue', !props.modelValue);
  }

  let ratio;
  if (typeof props.size === 'string') {
    switch (props.size.toLowerCase()) {
    case 'small':
      ratio = 0.7;
      break;
    case 'medium':
      ratio = 1;
      break;
    case 'big':
      ratio = 1.5;
      break;
    default:
      console.warn(`unknown size value: ${props.size}`)
      ratio = 1;
      break;
    }
  } else {
    ratio = props.size;
  }
</script>

<style scoped>
.checkbox-container {
  --checkbox-default-active-color: #63e060;
  --checkbox-default-inactive-color: #e1e1e1;

  position: relative;
  cursor: pointer;
}

.checkbox {
  position: absolute;
  top: 0;
  opacity: 0;
  height: 0;
  width: 0;
  cursor: pointer;
}

.checkmark {
  position: relative;
  width: calc(20px * v-bind('ratio'));
  aspect-ratio: 1 / 1;
  background-color: var(--checkbox-inactive-color,
    var(--checkbox-default-inactive-color));
  border-radius: calc(4px * v-bind('ratio'));
  transition: 0.1s;
  font-size: calc(20px * v-bind('ratio'));
}

.checkmark.checked {
  background-color: var(--checkbox-active-color,
    var(--checkbox-default-active-color));
}

.checkmark.frozen {
  opacity: 0.7;
  cursor: not-allowed;
}

.checkmark::after {
  position: absolute;
  content: "";
  opacity: 0;
  transition: 0.1s;
  top: 0.1em;
  left: 0.3em;
  height: 0.7em;
  width: 0.4em;
  border: solid #fff;
  border-width: 0 0.15em 0.15em 0;
  transform: rotate(45deg);
}

.checkmark.checked::after {
  opacity: 1;
}
</style>
