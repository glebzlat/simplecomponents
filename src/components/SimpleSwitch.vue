<template>
  <div class="switch" :tabindex="props.frozen ? -1 : 0"
       @keypress.enter="toggle">
    <div
      class="slider"
      :class="{ checked: modelValue, frozen: frozen }"
      @click="toggle"
    />
  </div>
</template>

<script setup>
  /**
   * Toggle switch
   * @displayName Toggle switch
   *
   * Switch component uses the following CSS variables:
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
      console.warn(`unknown size value: ${props.size}`);
      ratio = 1;
      break;
    }
  } else {
    ratio = props.size;
  }
</script>

<style scoped>
.switch {
  ---switch-color: var(--switch-color, #e8e8e8);
  ---switch-active-color: var(--switch-active-color, #63e060);
  ---switch-slider-color: var(--switch-slider-color, #fff);
  ---switch-slider-active-color: var(--switch-slider-active-color,
    var(---switch-slider-color));
  ---switch-hover-color: var(--switch-hover-color, var(---switch-active-color));
  ---switch-focus-color: var(--switch-focus-color, var(---switch-hover-color));

  position: relative;
  width: calc(2.88em * v-bind('ratio'));
  height: calc(1.5em * v-bind('ratio'));
  outline: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: 0.4s;
  background-color: var(---switch-color);
  border-radius: calc(1.5em * v-bind('ratio'));
}

.slider.frozen {
  opacity: 0.6;
  cursor: not-allowed;
}

.slider.checked {
  background-color: var(---switch-active-color)
}

.slider::before {
  position: absolute;
  content: "";
  width: calc(1em * v-bind('ratio'));
  aspect-ratio: 1 / 1;
  left: calc(0.25em * v-bind('ratio'));
  bottom: calc(0.25em * v-bind('ratio'));
  background-color: var(---switch-slider-color);
  transition: 0.4s;
  border-radius: 50%;
}

.switch:hover .slider {
  box-shadow: 0 0 0.062em calc(0.06em * v-bind('ratio'))
    var(---switch-hover-color);
}

.switch:focus .slider {
  box-shadow: 0 0 0.062em calc(0.06em * v-bind('ratio'))
    var(---switch-focus-color);
}

.switch:hover .slider.frozen,
.switch:focus .slider.frozen {
  box-shadow: none;
}

.checked::before {
  transform: translateX(calc(1.38em * v-bind('ratio')));
}

</style>
