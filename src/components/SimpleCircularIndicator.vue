<template>
  <svg
    class="indicator"
    viewBox="0 0 20 20"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      class="background"
      cx="10"
      cy="10"
      r="8"
    />
    <circle
      class="progress"
      cx="10"
      cy="10"
      r="8"
    />
    <text
      v-if="label"
      class="text"
      x="50%"
      y="46%"
      font-size="3.5"
    >{{ label }}</text>
    <text
      class="text"
      x="50%"
      :y="percentageY"
      font-size="3.5"
    >
      {{ percentage }}{{ isNaN(percentage) ? '' : '%' }}
    </text>
  </svg>
</template>

<script setup>
  /**
   * Circular indicator
   * @displayName Circular indicator
   *
   * Circular indicator is somehow similar to the car speed indicator.
   * Indicator takes percent value and converts it to the position of the
   * colored bar.
   *
   * The following variables control the appearance of the component:
   *   - `--circular-indicator-bg-color` - background color
   *   - `--circular-indicator-color`    - bar color
   */
  import { computed } from 'vue';

  const props = defineProps({
    /**
     * Percentage value. Should be in the range [0, 100], otherwise it will be
     * constrained.
     */
    percentage: {
      type: Number,
      required: true
    },

    /**
     * Optional indicator label placed under the percent value.
     */
    label: {
      type: String,
      default: null
    }
  });

  const inMin = 0, inMax = 100, outMin = -51, outMax = -90;

  const constrainedPercentage = computed(() => {
    if (typeof props.percentage !== 'number' || isNaN(props.percentage))
      return inMax;
    return Math.min(Math.max(props.percentage, inMin), inMax);
  });

  const value = computed(() => {
    return ((outMax - outMin) / (inMax - inMin) *
            (constrainedPercentage.value - inMin) + outMin);
  });

  const percentageY = props.label ? '63%' : '55%';
</script>

<style scoped>
.indicator {
  --circular-indicator-default-bg-color: #e1e1e1;
  --circular-indicator-default-color: #63e060;

  pointer-events: none;
}

.background {
  fill: none;
  stroke: var(--circular-indicator-bg-color,
    var(--circular-indicator-default-bg-color));
  stroke-width: 2;
  stroke-dasharray: 51 51;
  stroke-dashoffset: -90;
  stroke-linecap: round;
  transform-origin: center;
  transform: rotate(130deg);
}

.progress {
  fill: none;
  stroke: var(--circular-indicator-color,
    var(--circular-indicator-default-color));
  stroke-width: 2;
  stroke-dasharray: 51 51;
  stroke-dashoffset: v-bind('value');
  stroke-linecap: round;
  transform-origin: center;
  transform: rotate(130deg);
  transition: stroke 0.2s linear, stroke-dashoffset 0.3s linear;
}

.text {
  text-anchor: middle;
  fill: #555;
}
</style>
