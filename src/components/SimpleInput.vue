<template>
  <label class="input-wrapper" :class="{ error: errorMsg }">
    <div class="prefix-wrapper" v-if="slots['prefix']">
      <slot name="prefix" />
      <div class="delimiter prefix-delimiter"></div>
    </div>
    <input :type="inputType" :value="inputText" @input="handleInput"
           class="input-field" :placeholder="props.placeholder">
    <div class="suffix-wrapper" v-if="slots['suffix']">
      <slot name="suffix" />
      <div class="delimiter suffix-delimiter"></div>
    </div>
    <div class="show-wrapper" v-if="props.hidden">
      <button class="show-button" @click="toggleHide">
        <div class="show-button-foreground">
          <div class="show-icon-on" v-if="!hideInput">
            <slot name="showIconOn"><EyeOn /></slot>
          </div>
          <div class="show-icon-off" v-if="hideInput">
            <slot name="showIconOff"><EyeOff /></slot>
          </div>
        </div>
        <div class="show-button-background"></div>
      </button>
      <div class="delimiter suffix-delimiter"></div>
    </div>
    <div class="error-wrapper">
      <p class="error-text">{{ errorMsg }}</p>
    </div>
  </label>
</template>

<script setup>
  const props = defineProps({
    modelValue: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: 'Text input'
    },
    shape: {
      type: String,
      default: 'rect',
    },
    format: {
      type: [String, RegExp],
      default: undefined
    },
    error: {
      type: String,
      default: undefined
    },
    hidden: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['input', 'update:modelValue']);

  import { computed, ref, useSlots } from 'vue';
  import EyeOn from '../icons/EyeOn.vue';
  import EyeOff from '../icons/EyeOff.vue';

  const slots = useSlots();

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

  const hideInput = ref(true);

  const inputType = computed(() => {
    if (props.hidden && hideInput.value)
      return 'password';
    return 'text';
  });

  function toggleHide() {
    hideInput.value = !hideInput.value;
  }

  const inputText = ref(props.modelValue);
  const typedIn = ref(false);

  function handleInput(event) {
    inputText.value = event.target.value;
    typedIn.value = true;

    const data = errorMsg.value ? null : inputText.value;
    emit('input', data);
    emit('update:modelValue', data);
  }

  const formatRe = props.format ? new RegExp(props.format) : null;

  const correctFormat = computed(() => {
    if (!props.format)
      return true;
    return formatRe.test(inputText.value);
  });

  const errorMsg = computed(() => {
    if (!typedIn.value)
      return null;
    if (props.error)
      return props.error;
    if (!correctFormat.value)
      return "Incorrect format";
    return null;
  })

</script>

<style scoped>
  .input-wrapper {
    ---input-max-width: var(--input-max-width, auto);
    ---input-color: var(--input-color, #000);
    ---input-placeholder-color: var(--input-placeholder-color, #888);
    ---input-bg-color: var(--input-bg-color, #fff);
    ---input-border-color: var(--input-border-color, #c8c8c8);
    ---input-focus-bg-color: var(--input-focus-bg-color);
    ---input-error-color: var(--input-error-bg-color, red);
    ---input-focus-border-color: var(--input-focus-border-color, #2ecc71);

    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 0.5em;
    border: 0.06em solid var(---input-border-color);
    border-radius: calc(1em * v-bind("borderRadius"));
    background-color: var(---input-bg-color);
    transition: border 0.2s ease-in-out;
  }

  .input-wrapper:hover,
  .input-wrapper:focus-within {
    border: 0.1em solid var(---input-focus-border-color);
  }

  .input-field {
    color: var(---input-color);
    background-color: var(---input-bg-color);
    padding: 0.5em 0;
    margin: 0;
    border: none;
    outline: none;
    flex-basis: 100%;
  }

  .input-field::placeholder {
    color: var(---input-placeholder-color);
  }

  .prefix-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.2em;
    padding: 0.5em 0.4em 0.5em 0;
    margin: 0;
    margin-right: 0.3em;
  }

  .suffix-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.2em;
    padding: 0.5em 0 0.5em 0.4em;
    margin: 0;
    margin-left: 0.3em;
  }

  .show-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.2em;
    padding: 0.5em 0 0.5em 0.4em;
    margin: 0;
    margin-left: 0.3em;
  }

  .show-button {
    position: relative;
    width: 1em;
    height: 1em;
    border-radius: 0.3em;
    overflow: hidden;
  }

  .show-button-foreground {
    z-index: 0;
  }

  .show-button-background {
    position: absolute;
    z-index: -1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    background-color: var(---input-focus-border-color);
    transition: opacity 0.2s ease-in-out;
  }

  .show-button:focus .show-button-background,
  .show-button:hover .show-button-background {
    opacity: 0.3;
  }

  .delimiter {
    position: absolute;
    top: 0.30em;
    height: 1.4em;
    width: 0.06em;
    background-color: var(---input-border-color);
    opacity: 0.5;
  }

  .prefix-delimiter {
    right: 0;
  }

  .suffix-delimiter {
    left: 0;
  }

  .error-wrapper {
    position: absolute;
    z-index: 1;
    top: 100%;
    left: 0;
    font-size: 0.9em;
    display: flex;
    flex-direction: column;
    justify-content: end;
    padding-left: 0.5em;
    opacity: 0;
    height: 0;
    color: var(---input-error-color);
    background-color: var(---input-bg-color);
    transition: all 0.3s;
  }

  .input-wrapper.error .error-wrapper {
    opacity: 1;
    height: 1.2em;
  }

  .input-wrapper.error {
    border: 0.1em solid var(---input-error-color);
  }

</style>
