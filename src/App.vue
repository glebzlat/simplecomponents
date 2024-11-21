<template>
<div class="page">
  <div class="card circular-indicator-color-green">
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
    <Tooltip>
      <template v-slot:main-content>
        <div class="section checkbox-color-red">
          <Checkbox v-model="checkboxValue" size="medium" :frozen="false" />
          <p>{{ checkboxValue }}</p>
        </div>
      </template>
      <template v-slot:tooltip-content>Simple checkbox</template>
    </Tooltip>
    <Tooltip>
      <template v-slot:main-content>
        <div class="section checkbox-color-green">
          <Checkbox v-model="frozeCheckbox" size="medium" :frozen="false" />
          <Checkbox v-model="frozenCheckbox" size="medium"
              :frozen="frozeCheckbox" />
          <p>{{ frozenCheckbox }}</p>
        </div>
      </template>
      <template v-slot:tooltip-content>One checkbox freezes another</template>
    </Tooltip>
    <Tooltip max-width="150px">
      <template v-slot:main-content>
        <div class="section checkbox-color-blue">
          <Checkbox v-model="masterCheckbox" size="medium" :frozen="false" />
          <Checkbox v-model="masterCheckbox" size="medium"
              :frozen="true" />
        </div>
      </template>
      <template v-slot:tooltip-content>
        Freezed checkbox mirrors non-freezed checkbox changes
      </template>
    </Tooltip>
  </div>
  <div class="card dropdown-settings">
    <Dropdown class="dropdown" v-model="dropdownState"
      :options="dropdownOptions" />
  </div>
</div>
</template>

<script setup>
  import { ref } from 'vue';

  import CircularIndicator from './components/CircularIndicator.vue';
  import Switch from './components/Switch.vue';
  import Checkbox from './components/Checkbox.vue';
  import Tooltip from './components/Tooltip.vue';
  import Dropdown from './components/Dropdown.vue';

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

  const dropdownOptions = [
    'Item 1',
    'Item 2 with very very very long name',
    'Item 3'
  ];
  const dropdownState = ref(0);

</script>

<style scoped>
.page {
  --tooltip-background-color: #222;
  --tooltip-color: #fff;
  --tooltip-font-size: 14px;

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

.circular-indicator-color-green {
  --circular-indicator-bg-color: #eee;
  --circular-indicator-color: #2ecc71;
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

.dropdown-settings {
  --dropdown-color: black;
  --dropdown-content-bg-color: #e1e1e1;
  --dropdown-bg-color: #e1e1e1;
  --dropdown-hover-bg-color: #2ecc71;
  --dropdown-item-hover-bg-color: #2ecc71;
}

.dropdown {
  width: 200px;
}

</style>
