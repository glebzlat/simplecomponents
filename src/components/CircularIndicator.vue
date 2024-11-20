<template>
  <svg class="indicator" width="150" viewBox="0 0 20 20"
      version="1.1" xmlns="http://www.w3.org/2000/svg">
    <circle class="background" cx="10" cy="10" r="8"></circle>
    <circle class="progress" cx="10" cy="10" r="8"></circle>
    <text class="text" v-if='label' x="50%" y="46%">{{ label }}</text>
    <text class="text" x="50%" :y="percentageY">{{ percentage }}%</text>
  </svg>
</template>

<script>
  /**
   * Circular indicator
   * @displayName Circular indicator
   */
  export default {
    name: 'CircularIndicator',
    props: {
      /**
       * The percentage value of the indicator, must be in the range [0, 100].
       */
      percentage: Number,
      /**
       * Optional indicator label. Displayed under the percentage if given.
       */
      label: {
        type: String,
        default: null
      },
      /**
       * The default color of a bar.
       */
      color: {
        type: String,
        default: '#2ecc71'
      },
      /**
       * The default inactive color.
       */
      backgroundColor: {
        type: String,
        default: '#00000011'
      },
    },
    computed: {
      constrainedPercentage() {
        const inMin = 0, inMax = 100, outMin = -51, outMax = -90;
        console.log(`percentage=${this.percentage}`)
        if (typeof this.percentage !== 'number' || isNaN(this.percentage))
          return inMax;
        return Math.min(Math.max(this.percentage, inMin), inMax);
      },
      value() {
        const inMin = 0, inMax = 100, outMin = -51, outMax = -90;
        return ((outMax - outMin) / (inMax - inMin) *
          (this.constrainedPercentage - inMin) + outMin);
      },
    },
    setup(props) {
      const percentageY = props.label ? '63%' : '55%';
      return { percentageY };
    }
  }
</script>

<style scoped>
.indicator {
  pointer-events: none;
}

.background {
  fill: none;
  stroke: v-bind('backgroundColor');
  stroke-width: 2;
  stroke-dasharray: 51 51;
  stroke-dashoffset: -90;
  stroke-linecap: round;
  transform-origin: center;
  transform: rotate(130deg);
}

.progress {
  fill: none;
  stroke: v-bind('color');
  stroke-width: 2;
  stroke-dasharray: 51 51;
  stroke-dashoffset: v-bind('value');
  stroke-linecap: round;
  transform-origin: center;
  transform: rotate(130deg);
  transition: stroke 0.2s linear, stroke-dashoffset 0.3s linear;
}

.text {
  font-size: 0.2em;
  text-anchor: middle;
  fill: #555;
}
</style>
