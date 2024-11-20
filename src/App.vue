<template>
<div class="page">
  <div class="card">
    <CircularIndicator :percentage="parseInt(value)" :label='label'
      :thres-colors='{"70":"yellow","80":"red"}' />
    <input type="text" class="percentage-input" v-model="value" />
  </div>
</div>
</template>

<script setup>
  import CircularIndicator from './components/CircularIndicator.vue';
  import { ref } from 'vue';

  const label = 'CPU';
  const value = ref('100');

</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border: 1px solid grey;
  border-radius: 5px;
  width: fit-content;
}
</style>
