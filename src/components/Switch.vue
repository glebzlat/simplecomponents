<template>
  <div class="switch">
    <div class="slider" :class="{ checked: modelValue, frozen: frozen }"
        @click="toggle"></div>
  </div>
</template>

<script setup>
  /**
   * Toggle switch
   * @displayName Toggle switch
   *
   * Toggle switch component expects the following CSS variables to be set
   * on parent element:
   *   - `--switch-active-color`
   *   - `--switch-inactive-color`
   *   - `--switch-slider-color`
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
      ratio = 0.5;
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
.switch {
  position: relative;
  width: calc(46px * v-bind('ratio'));
  height: calc(24px * v-bind('ratio'));
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: 0.4s;
  background-color: var(--switch-inactive-color);
  border-radius: calc(24px * v-bind('ratio'));
}

.slider.frozen {
  opacity: 0.6;
  cursor: not-allowed;
}

.slider.checked {
  background-color: var(--switch-active-color);
}

.slider::before {
  position: absolute;
  content: "";
  width: calc(16px * v-bind('ratio'));
  aspect-ratio: 1 / 1;
  left: calc(4px * v-bind('ratio'));
  bottom: calc(4px * v-bind('ratio'));
  background-color: var(--switch-slider-color);
  transition: 0.4s;
  border-radius: 50%;
}

.switch:hover .slider {
  box-shadow: 0 0 1px calc(1px * v-bind('ratio')) var(--switch-active-color);
}

.switch:hover .slider.frozen {
  box-shadow: none;
}

.checked::before {
  transform: translateX(calc(22px * v-bind('ratio')));
}

</style>
