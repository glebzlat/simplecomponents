<template>
  <div class="input-list-wrapper">
    <ul class="input-list">
      <li class="input-list-item" v-for="_, idx in inputFields">
        <SimpleInput v-model="inputFields[idx]" @update:modelValue="(val) => handleUpdate(idx, val)"/>
        <SimpleButton class="button-remove" :class="`button-${idx}`"
            @click="removeField(idx)">
          {{ props.titleRemove }}
        </SimpleButton>
      </li>
    </ul>
    <SimpleButton class="button-add" @click="addField" width="100%">
      {{ props.titleAdd }}
    </SimpleButton>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import SimpleInput from './SimpleInput.vue';

  const props = defineProps({
    modelValue: {
      type: Array
    },
    titleAdd: {
      type: String,
      default: 'Add'
    },
    titleRemove: {
      type: String,
      default: '\u2013'
    }
  });

  const emit = defineEmits(['update:modelValue']);

  const inputFields = computed({
    get() {
      return props.modelValue;
    },
    set(v) {
      emit('update:modelValue', v);
    }
  });

  function handleUpdate(idx, val) {
    inputFields.value[idx] = val;
  }

  function removeField(idx) {
    inputFields.value.splice(idx, 1);
  }

  function addField() {
    inputFields.value.push('');
  }
</script>

<style scoped>
  .input-list-wrapper {
    ---input-list-min-width: var(--input-list-min-width, 16em);

    min-width: var(---input-list-min-width);
    display: flex;
    flex-direction: column;
    gap: 0.6em 0;
  }

  .input-list {
    display: flex;
    flex-direction: column;
    gap: 0.4em 0;
  }

  .input-list-item {
    display: flex;
    gap: 0 0.3em;
  }

  .button-remove {
    flex-basis: 20%;
    --button-bg-color: #db4c4c;
    --button-hover-bg-color: #ea7474;
    --button-focus-color: #ea7474;
    --button-active-color: #ea7474;
  }
</style>
