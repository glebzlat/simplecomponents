<template>
<div class="page">
  <div class="card">
    <CircularIndicator :percentage="parseInt(value)" :label='label'
      :thres-colors='{"70":"yellow","80":"red"}' />
    <input type="text" class="percentage-input" v-model="value" />
  </div>
  <div class="card">
    <div class="section switch-color-red">
      <Switch v-model="switchValue" size="medium" :frozen="false" />
      <p>{{ switchValue }}</p>
    </div>
    <div class="section switch-color-green">
      <Switch v-model="frozeSwitch" size="medium" :frozen="false" />
      <Switch v-model="frozenValue" size="medium" :frozen="frozeSwitch" />
      <p>{{ frozenValue }}</p>
    </div>
    <div class="section switch-color-blue">
      <Switch v-model="masterSwitch" size="medium" :frozen="false" />
      <Switch v-model="masterSwitch" size="medium" :frozen="true" />
    </div>
  </div>
  <div class="card">
    <div class="section checkbox-color-red">
      <Checkbox v-model="checkboxValue" size="medium" :frozen="false" />
      <p>{{ checkboxValue }}</p>
    </div>
    <div class="section checkbox-color-green">
      <Checkbox v-model="frozeCheckbox" size="medium" :frozen="false" />
      <Checkbox v-model="frozenCheckbox" size="medium"
          :frozen="frozeCheckbox" />
      <p>{{ frozenCheckbox }}</p>
    </div>
    <div class="section checkbox-color-blue">
      <Checkbox v-model="masterCheckbox" size="medium" :frozen="false" />
      <Checkbox v-model="masterCheckbox" size="medium"
          :frozen="true" />
    </div>
  </div>
</div>
</template>

<script setup>
  import { ref } from 'vue';

  import CircularIndicator from './components/CircularIndicator.vue';
  import Switch from './components/Switch.vue';
  import Checkbox from './components/Checkbox.vue';

  const label = 'CPU';
  const value = ref('100');

  const switchValue = ref(false);
  const frozeSwitch = ref(false);
  const frozenValue = ref(false);
  const masterSwitch = ref(false);

  const checkboxValue = ref(false);
  const frozeCheckbox = ref(false);
  const frozenCheckbox = ref(false);
  const masterCheckbox = ref(false);

</script>

<style scoped>
.page {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

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

.section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  width: 200px;
  border: 1px solid grey;
  border-radius: 5px;
}

.switch-color-red {
  --switch-active-color: #cc2e2e;
  --switch-inactive-color: #ccc;
  --switch-slider-color: #fff;
}

.switch-color-green {
  --switch-active-color: #2ecc71;
  --switch-inactive-color: #ccc;
  --switch-slider-color: #fff;
}

.switch-color-blue {
  --switch-active-color: #397dff;
  --switch-inactive-color: #ccc;
  --switch-slider-color: #fff;
}

.checkbox-color-red {
  --checkbox-active-color: #cc2e2e;
  --checkbox-inactive-color: #ccc;
}

.checkbox-color-green {
  --checkbox-active-color: #2ecc71;
  --checkbox-inactive-color: #ccc;
}

.checkbox-color-blue {
  --checkbox-active-color: #397dff;
  --checkbox-inactive-color: #ccc;
}
</style>
