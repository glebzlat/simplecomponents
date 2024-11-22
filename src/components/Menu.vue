<template>
  <div class="menu">
    <ul class="menu-list">
      <li
          class="menu-top-item"
          v-for="item, top_idx in options"
          :key="top_idx"
          :class="{
                   active: activeTopIdx === top_idx,
                   opened: openedTopIdx === top_idx
          }"
          >
        <button
            class="menu-button menu-top-item-btn"
            @click="activateTop(top_idx)">
          {{ item.label }}
        </button>
        <ul
            class="menu-nested-list"
            :class="{ active: activeTopIdx === top_idx }"
            v-if="item.children">
          <li
              class="menu-button menu-nested-item"
              v-for="child, idx in item.children"
              :key="idx">
            <button
                class="menu-nested-item-btn"
                :class="{ active: activeNestedIdx === idx }"
                @click="activateNested(idx)">
              {{ child.label }}
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const props = defineProps({
    /**
     * Options is an array of objects, each of the following structure:
     *
     * ```
     * option: {
     *   label: String,
     *   value?: Any,
     *   icon?: () => VNode,
     *   children?: Array<option>
     * }
     * ```
     *
     * `value` property can be unset, if `children` is set. Options with
     * `children` serve only as containers for sub-items. If `children` is set,
     * then item will never be "activated" and so an event, containing its
     * assigned value, will never be emitted.
     */
    options: {
      type: Array,
      required: true
    }
  });

  const emit = defineEmits(['update:value']);

  const activeTopIdx = ref(undefined);
  const openedTopIdx = ref(undefined);
  const activeNestedIdx = ref(undefined);

  function activateTop(idx) {
    // Top items with children cannot be activated - they serve only as
    // a container for sub-items.
    if (props.options[idx].children) {
      // If the index is different, then we open another sub-list. Otherwise,
      // just close currently opened list by setting openedTopIdx to undefined.
      if (openedTopIdx.value === idx) {
        openedTopIdx.value = undefined;
      } else {
        openedTopIdx.value = idx;
      }
    } else {
      activeTopIdx.value = idx;
      emit('update:value', props.options[idx].value);
    }
  }

  function activateNested(idx) {
    if (openedTopIdx.value === undefined)
      console.error('openedTopIdx is undefined');

    activeNestedIdx.value = idx;
    emit('update:value', props.options[openedTopIdx.value].children[idx]);
  }
</script>

<style scoped>
.menu-button {
  padding: 0.7em;
  border-radius: 0.3em;
}

.menu-nested-list {
  list-style: none;
  /* transition does not work with height: auto */
  height: 0;
  opacity: 0;
  overflow: hidden;
  transition: all 0.5s;
}

.menu-top-item.opened .menu-nested-list {
  height: auto;
  opacity: 1;
}
</style>
