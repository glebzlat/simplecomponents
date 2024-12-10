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
   *
   * The following CSS variables alter the component appearance:
   *   - `--button-color`
   *   - `--button-bg-color`
   *   - `--button-padding`
   *   - `--button-hover-bg-color`
   *   - `--button-focus-color`
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
  ---button-color: var(--button-color, #000);
  ---button-bg-color: var(--button-bg-color, #e8e8e8);
  ---button-padding: var(--button-padding, 0.5em);
  ---button-hover-bg-color: var(--button-hover-bg-color, #c7f1d9);
  ---button-focus-color: var(--button-focus-color, #2ecc71);

  ---button-shadow-color: var(---button-active-bg-color);

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(---button-padding);
  border-radius: calc(v-bind('borderRadius') * 1em);
  width: calc(v-bind('width') + var(---button-padding) * 2);

  color: var(---button-color);
  background-color: var(---button-bg-color);
  outline: 0.0625em solid transparent;

  transition: all 0.2s;
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.button:not([disabled]):hover {
  background-color: var(---button-hover-bg-color);
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
  box-shadow: 0 0 0.05em 0.4em var(---button-shadow-color);

  opacity: 0;
  transition: all 0.5s, outline 0.1s;
}

.button:focus {
  outline: 0.0625em solid var(---button-focus-color);
}

.button:active,
.button.active {
  background-color: var(---button-active-color) !important;
}

.button:active:after,
.button.active:after {
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
  top: var(---button-padding);
  left: var(---button-padding);
  width: 1em;
  padding: 0.1em;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: var(---button-color);
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
