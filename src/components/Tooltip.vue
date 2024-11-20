<template>
  <div class="container">
    <slot name="main-content" />
    <div class="tooltip">
      <div class="tooltip-inner">
        <slot name="tooltip-content"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
  /**
   * Tooltip
   * @displayName Tooltip
   *
   * Tooltip component shows a message under the content.
   *
   * Tooltip expects parent component to set the following CSS variables:
   *   - `--tooltip-background-color`
   *   - `--tooltip-color`
   *   - `--tooltip-font-size`
   */
  const props = defineProps({
    delay: {
      type: Number,
      default: 0.4
    },
    maxWidth: {
      type: [Number, String],
      default: 'auto'
    }
  });

</script>

<style scoped>
.container {
  all: inherit;
  padding: 0;
  margin: 0;
  border: none;
  position: relative;
}

.tooltip {
  position: absolute;
  z-index: 1;
  top: calc(100%);
  pointer-events: none;
  transition: 0.2s opacity ease-in-out 0.4s;
  opacity: 0;
  background-color: transparent;
  font-size: var(--tooltip-font-size);
}

.tooltip-inner {
  position: relative;
  padding: 0.5em;
  margin: 0.5em auto;
  border-radius: 0.3em;
  background-color: var(--tooltip-background-color);
  color: var(--tooltip-color);
  width: max-content;
  max-width: v-bind('maxWidth');
}

.tooltip-inner::after {
  position: absolute;
  z-index: 1;
  content: "";
  bottom: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent var(--tooltip-background-color)
    transparent;
}

.container:hover .tooltip,
.tooltip:hover {
  opacity: 1;
  pointer-events: all;
  transition-delay: calc(v-bind('delay') * 1s);
}
</style>
