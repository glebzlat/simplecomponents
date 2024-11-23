<template>
  <div class="menu">
    <ul class="menu-list">
      <li
          class="menu-item"
          v-for="item, top_idx in options"
          :key="top_idx"
          :class="{ active: active === item.key,
                    opened: openedTopIdx === top_idx }"
          >
        <button
            class="menu-button menu-top-btn"
            @click="activateTop(top_idx)">
          <p>{{ item.label }}</p>
          <div class="menu-arrow" v-if="item.children"></div>
        </button>
        <ul
            class="menu-nested-list"
            :class="`menu-list-${top_idx}`"
            v-if="item.children"
            ref="nestedLists">
          <li
              class="menu-item"
              v-for="child, idx in item.children"
              :class="{ active: active === child.key }"
              :key="idx">
            <button
                class="menu-button menu-nested-btn"
                @click="activateNested(idx)">
              <p>{{ child.label }}</p>
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
     *   key?: String,
     *   label: String,
     *   icon?: () => VNode,
     *   children?: Array<option>
     * }
     * ```
     *
     * `key` property can be unset, if `children` is set. Options with
     * `children` serve only as containers for sub-items. If `children` is set,
     * then item will never be "activated" and so an event, containing its
     * assigned key, will never be emitted.
     */
    options: {
      type: Array,
      required: true
    },
    active: {
      type: String,
      default: null
    }
  });

  const emit = defineEmits(['update:value']);

  const openedTopIdx = ref(undefined);

  const nestedLists = ref([]);

  function getList(idx) {
    const className = `menu-list-${idx}`;
    for (let el of nestedLists.value)
      if (el.classList.contains(className))
        return el;
    return null;
  }

  function expandList(lst) {
    lst.style.maxHeight = lst.scrollHeight + 'px';
    lst.style.opacity = '1';
    lst.style.marginTop = '0.5em';
  }

  function collapseList(lst) {
    // lst.style.removeProperty('max-height');
    lst.style.maxHeight = '0';
    lst.style.opacity = '0';
    lst.style.marginTop = '0';
  }

  function activateTop(idx) {
    if (props.options[idx].children) {
      const lst = getList(idx);
      if (!lst) {
        console.error(`list with index ${idx} does not exist`);
        return;
      }

      // If the index is different, then we open another sub-list. Otherwise,
      // just close currently opened list by setting openedTopIdx to undefined.
      if (openedTopIdx.value === idx) {
        collapseList(lst);
        openedTopIdx.value = undefined;
      } else if (openedTopIdx.value === undefined){
        expandList(lst);
        openedTopIdx.value = idx;
      } else {
        collapseList(getList(openedTopIdx.value));
        expandList(lst);
        openedTopIdx.value = idx;
      }
    } else {
      const key = props.options[idx].key;
      if (key !== props.active) {
        emit('update:value', props.options[idx].key);
      }
    }
  }

  function activateNested(idx) {
    if (openedTopIdx.value === undefined)
      console.error('openedTopIdx is undefined');

    const key = props.options[openedTopIdx.value].children[idx].key
    if (key !== props.active)
      emit('update:value', key);
  }
</script>

<style scoped>
.menu {
  --menu-default-color: #000;
  --menu-default-active-color: var(--menu-active-color,
    var(--menu-default-color));
  --menu-default-hover-color: var(--menu-hover-color,
    var(--menu-default-color));
  --menu-default-bg-color: transparent;
  --menu-default-active-bg-color: #2ecc71;
  --menu-default-hover-bg-color: #2ecc7144;

  --menu-default-nested-color: var(--menu-nested-color,
    var(--menu-default-color));
  --menu-default-nested-hover-color: var(--menu-nested-hover-color,
    var(--menu-default-nested-color));
  --menu-default-nested-active-color: var(--menu-nested-active-color,
    var(--menu-default-nested-color));
  --menu-default-nested-list-bg-color: #e1e1e199;
  --menu-default-nested-hover-bg-color: #2ecc7144;
  --menu-default-nested-active-bg-color: #2ecc71;

  --menu-default-font-size: inherit;

  font-size: var(--menu-font-size, var(--menu-default-font-size));
  background-color: var(--menu-bg-color, var(--menu-default-bg-color));
}

.menu-item {
  width: 100%;
}

.menu-item + .menu-item {
  margin-top: 0.5em;
}

.menu-button {
  display: flex;
  gap: 0 0.2em;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1em;
  border-radius: 0.3em;

  color: var(--menu-color, var(--menu-default-color));
  transition: 0.2s;
}

.menu-arrow {
  width: 0.4em;
  aspect-ratio: 1 / 1;
  border-color: var(--menu-color, var(--menu-default-color));
  border-style: solid;
  border-width: 0.15em 0.15em 0 0;
  background-color: transparent;
  transform: rotate(45deg);
  transform-origin: 0.25em 0.15em;
  transition: 0.3s;
}

.menu-item.opened .menu-top-button,
.menu-button:hover {
  --color: var(--menu-hover-color, var(--menu-default-hover-color))
  color: var(--color);
  --bg-color: var(--menu-hover-bg-color,
    var(--menu-default-hover-bg-color));

  background-color: var(--bg-color);
}

.menu-button:hover .menu-arrow {
  --bg-color: var(--menu-hover-bg-color,
    var(--menu-default-hover-bg-color));

  border-color: var(--color);
}

.menu-item.opened .menu-arrow {
  transform: rotate(135deg);
}

.menu-item.active .menu-top-btn {
  color: var(--menu-active-color, var(--menu-default-active-color));
  background-color: var(--menu-active-bg-color,
    var(--menu-default-active-bg-color));
}

.menu-item.active .menu-nested-btn {
  color: var(--menu-nested-active-color,
    var(--menu-default-nested-active-color));
  background-color: var(--menu-nested-active-bg-color,
    var(--menu-default-nested-active-bg-color));
}

.menu-nested-btn:hover {
  color: var(--menu-nested-hover-color,
    var(--menu-default-nested-hover-color));
  background-color: var(--menu-nested-hover-bg-color,
    var(--menu-default-nested-hover-bg-color));
}

.menu-nested-list {
  margin-top: 0;
  border-radius: 0.3em;
  list-style: none;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: opacity 0.7s, all 0.3s;

  background-color: var(--menu-nested-list-bg-color,
    var(--menu-default-nested-list-bg-color));
}

</style>
