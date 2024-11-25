<template>
  <button
    class="button"
    :class="{ loading: loading }"
    :disabled="frozen"
  >
    <div
      v-if="slots['icon']"
      class="button-icon"
    >
      <slot name="icon" />
    </div>
    <div
      class="button-loading"
      :class="{ loading: loading }"
    />
    <div
      class="button-content"
      :class="{
        loading: loading && hasSlot('default') && !slots['icon'],
        'icon-margin': slots['icon']
      }"
    >
      <slot />
    </div>
  </button>
</template>

<script setup>
  /**
   * Button component
   * @displayName Button
   */
  import { computed, useSlots } from 'vue';

  const props = defineProps({
    loading: {
      type: Boolean,
      default: false
    },
    shape: {
      type: String,
      default: 'rect'
    },
    frozen: {
      type: Boolean,
      default: false
    }
  });

  const slots = useSlots();

  function hasSlot(name) {
    return !!slots[name];
  }

  const borderRadius = computed(() => {
    switch (props.shape.toLowerCase()) {
    case 'rect':
      return 0.3;
    case 'round':
      return 1.5;
    default:
      console.error(`unknown value: ${props.shape}`);
      return 0.3;
    }
  });

  const width = computed(() => {
    if (!hasSlot('default'))
      return '1em';
    return 'auto';
  });

</script>

<style scoped>
.button {
  --button-default-color: #000;
  --button-default-bg-color: #e1e1e1;
  --button-default-hover-color: var(--button-default-color);
  --button-default-hover-bg-color: var(--button-default-bg-color);
  --button-default-font-size: inherit;
  --button-default-padding: 0.7em;

  --button-shadow-color: var(--button-hover-bg-color,
    var(--button-default-hover-bg-color));
  --button-result-padding: var(--button-padding,
    var(--button-default-padding));

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--button-result-padding);
  border-radius: calc(v-bind('borderRadius') * 1em);
  width: calc(v-bind('width') + var(--button-result-padding) * 2);

  font-size: var(--button-font-size, var(--button-default-font-size));
  color: var(--button-color, var(--button-default-color));
  background-color: var(--button-bg-color, var(--button-default-bg-color));

  transition: all 0.2s;
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.button:not([disabled]):hover {
  background-color: var(--button-hover-bg-color,
    var(--button-default-hover-bg-color));
  color: var(--button-hover-color, var(--button-default-hover-color));
}

.button:not([disabled]):after {
  content: "";
  position: absolute;
  display: block;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: calc(v-bind('borderRadius') * 1em);
  box-shadow: 0 0 0.5em 0.5em var(--button-shadow-color);

  opacity: 0;
  transition: all 0.5s;
}

.button:active:after {
  box-shadow: 0 0 0 0 var(--button-shadow-color);
  opacity: 1;
  transition: 0s;
}

.button-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1em;
  aspect-ratio: 1 / 1;
  opacity: 1;
  transition: opacity 0.3s;
}

.button-loading {
  position: absolute;
  top: 0.7em;
  left: 0.7em;
  width: 1em;
  padding: 0.1em;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--button-color, var(--button-default-color));
  --_m:
    conic-gradient(#0000 10%,#000),
    linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
          mask: var(--_m);
  -webkit-mask-composite: source-out;
          mask-composite: subtract;
  animation: l3 1s infinite linear;
  opacity: 0;
  transition: opacity 0.2s ease-out;
}
@keyframes l3 {
  to { transform: rotate(1turn) }
}

.button.loading .button-icon {
  opacity: 0;
}

.button-loading.loading {
  transition: opacity 0.5s ease-in;
  opacity: 1;
}

.button-content {
  min-height: 1em;
  margin-left: 0;
  transition: margin-left 0.3s ease-in-out;
}

.button-content.loading {
  margin-left: 1.5em;
}

.button-content.icon-margin {
  margin-left: 0.5em;
}

</style>
