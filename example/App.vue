<template>
  <div class="page">
    <div class="card circular-indicator-color-green">
      <SimpleCircularIndicator
        :percentage="parseInt(value)"
        :label="label"
      />
      <input
        v-model="value"
        type="text"
        class="percentage-input"
      >
    </div>
    <div class="card">
      <div class="section switch-color-red">
        <SimpleSwitch
          v-model="switchValue"
          size="medium"
          :frozen="false"
        />
        <p>{{ switchValue }}</p>
      </div>
      <div class="section switch-color-green">
        <SimpleSwitch
          v-model="frozeSwitch"
          size="medium"
          :frozen="false"
        />
        <SimpleSwitch
          v-model="frozenValue"
          size="medium"
          :frozen="frozeSwitch"
        />
        <p>{{ frozenValue }}</p>
      </div>
      <div class="section switch-color-blue">
        <SimpleSwitch
          v-model="masterSwitch"
          size="medium"
          :frozen="false"
        />
        <SimpleSwitch
          v-model="masterSwitch"
          size="medium"
          :frozen="true"
        />
      </div>
    </div>
    <div class="card">
      <SimpleTooltip>
        <template #main-content>
          <div class="section checkbox-color-red">
            <SimpleCheckbox
              v-model="checkboxValue"
              size="medium"
              :frozen="false"
              style="display: flex; align-items: center; gap: 0 0.5em;"
            >
              Text
            </SimpleCheckbox>
            <p>{{ checkboxValue }}</p>
          </div>
        </template>
        <template #tooltip-content>
          Simple checkbox
        </template>
      </SimpleTooltip>
      <SimpleTooltip>
        <template #main-content>
          <div class="section checkbox-color-green">
            <SimpleCheckbox
              v-model="frozeCheckbox"
              size="medium"
              :frozen="false"
            />
            <SimpleCheckbox
              v-model="frozenCheckbox"
              size="medium"
              :frozen="frozeCheckbox"
            />
            <p>{{ frozenCheckbox }}</p>
          </div>
        </template>
        <template #tooltip-content>
          One checkbox freezes another
        </template>
      </SimpleTooltip>
      <SimpleTooltip max-width="150px">
        <template #main-content>
          <div class="section checkbox-color-blue">
            <SimpleCheckbox
              v-model="masterCheckbox"
              size="medium"
              :frozen="false"
            />
            <SimpleCheckbox
              v-model="masterCheckbox"
              size="medium"
              :frozen="true"
            />
          </div>
        </template>
        <template #tooltip-content>
          Freezed checkbox mirrors non-freezed checkbox changes
        </template>
      </SimpleTooltip>
    </div>
    <div class="card dropdown-settings">
      <SimpleDropdown
        v-model="dropdownState"
        class="dropdown"
        :options="dropdownOptions"
      />
    </div>
    <div class="card button-settings">
      <div class="section">
        <SimpleButton
          ref="button1"
          :loading="button1Loading"
          shape="round"
          @click="button1Click"
        >
          My Button
        </SimpleButton>
        <SimpleButton
          :loading="button1Loading"
          shape="round"
          :frozen="true"
        >
          Frozen Button
        </SimpleButton>
      </div>
      <div class="section">
        <SimpleButton
          :loading="button2Loading"
          @click="button2Click"
        >
          <template #icon>
            <component :is="simpleIcon" />
          </template>
          With Icon
        </SimpleButton>
      </div>
    </div>
    <div class="card">
      <p v-if="!activeMenuItem">
        Choose an item
      </p>
      <p v-else>
        Chosen: {{ activeMenuItem }}
      </p>
      <SimpleMenu
        :options="menuOptions"
        :active="activeMenuItem"
        @update:value="setActiveMenuItem"
      />
    </div>
    <div class="card">
      <SimpleInput placeholder="example">
        <template #prefix>https://</template>
        <template #suffix>.com</template>
      </SimpleInput>
      <SimpleInput placeholder="password" :hidden="true" >
      </SimpleInput>
      <SimpleInput :format="ipFormat" v-model="inputIP">
        <template #prefix>IPv4</template>
      </SimpleInput>
      <p>Input IP: {{ inputIP }}</p>
    </div>
  </div>
</template>

<script setup>
  import { ref, h } from 'vue';

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

  const button1 = ref(null);
  const button1Loading = ref(false);
  const button2Loading = ref(false);

  function button1Click() {
    button1Loading.value = true;
    setTimeout(() => button1Loading.value = false, 1000);
  }

  function button2Click() {
    button2Loading.value = true;
    setTimeout(() => button2Loading.value = false, 2000);
  }

  const simpleIcon = h('svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '24',
      height: '24',
      fill: 'currentColor'
    },
    [
      h('circle', { cx: '12', cy: '12', r: '10', fill: '#4CAF50' }), // Green circle
      h('rect', { width: '12', height: '12', x: '6', y: '6', rx: '3', ry: '3',fill: '#fff' })
  ]);

  const menuOptions = [
    {
      label: 'Item 1',
      icon: simpleIcon,
      children: [
        {
          key: 'item1sub1',
          label: 'Sub Item 1'
        },
        {
          key: 'item1sub2',
          label: 'Sub Item 2'
        }
      ]
    },
    {
      label: 'Item 2',
      icon: simpleIcon,
      children: [
        {
          key: 'item2sub1',
          label: 'Sub Item 1'
        }
      ]
    },
    {
      key: 'item3',
      label: 'Item 3'
    }
  ];

  const activeMenuItem = ref(undefined);

  function setActiveMenuItem(key) {
    console.log(`active menu item: ${key}`);
    activeMenuItem.value = key;
  }

  const ipFormat = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;

  const inputIP = ref('nothing yet');

  function handleInputIP(text) {
    inputIP.value = text ? text : 'wrong format';
  }
</script>

<style scoped>
.page {
  --tooltip-font-size: 0.9em;

  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
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
  gap: 1em 3em;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px;
  min-width: 200px;
  width: 100%;
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

.button-settings {
  --button-hover-bg-color: #2ecc71;
}

</style>
