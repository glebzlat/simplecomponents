<template>
  <div class="menu">
    <ul class="menu-list">
      <li
        v-for="item, top_idx in options"
        :key="top_idx"
        class="menu-item"
        :class="{ active: active === item.key,
                  opened: openedTopIdx === top_idx }"
      >
        <button
          class="menu-button menu-top-btn"
          @click="activateTop(top_idx)"
        >
          <div
            v-if="hasIcon"
            class="menu-icon"
          >
            <component
              :is="item.icon"
              v-if="item.icon"
            />
          </div>
          <p v-if="item.label">{{ item.label }}</p>
          <div
            v-if="item.children"
            class="menu-arrow"
          />
          <div class="menu-button-inner-border"></div>
        </button>
        <ul
          v-if="item.children"
          ref="nestedLists"
          class="menu-nested-list"
          :class="`menu-list-${top_idx}`"
        >
          <li
            v-for="child, idx in item.children"
            :key="idx"
            class="menu-item"
            :class="{ active: active === child.key }"
          >
            <button
              class="menu-button menu-nested-btn"
              tabindex="-1"
              @click="activateNested(idx)"
            >
              <div
                v-if="hasIcon"
                class="menu-icon"
              >
                <component
                  :is="child.icon"
                  v-if="child.icon"
                />
              </div>
              <p v-if="child.label">{{ child.label }}</p>
              <div class="menu-button-inner-border"></div>
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup>
  /**
   * Menu component
   * @displayName Menu
   *
   * Menu is a component for structuring nested options with one nesting level.
   * It takes a list of options, where each option is an object:
   *
   * ```
   * option: {
   *   key?: String,
   *   label?: String,
   *   icon?: VNode | () => VNode,
   *   children?: Array<option>
   * }
   * ```
   *
   * `key` is a unique identifier of a particular option. When the user chooses
   * an option, and option has no children, then an event with the
   * corresponding key is emitted. If an option has `children` attribute, then,
   * when the user chooses it, the corresponding nested list opens. `key` is
   * required, if `children` is not set.
   *
   * `label` is a string that is displayed to the user.
   *
   * `icon` is an option icon. If at least one option has an icon, all options'
   * content is aligned by the icon's fixed width.
   *
   * `children` is an array of options. Note that Menu supports only one level
   * of nesting.
   *
   * The following CSS variables control the appearance of the Menu:
   *   - `--menu-color`
   *   - `--menu-active-color`
   *   - `--menu-hover-color`
   *   - `--menu-bg-color`
   *   - `--menu-active-bg-color`
   *   - `--menu-hover-bg-color`
   *   - `--menu-nested-color`
   *   - `--menu-nested-hover-color`
   *   - `--menu-nested-active-color`
   *   - `--menu-nested-list-bg-color`
   *   - `--menu-nested-hover-bg-color`
   *   - `--menu-nested-active-bg-color`
   *   - `--menu-font-size`
   */
  import { ref, computed, watch, nextTick } from 'vue';
  import deepEqual from '../utils/deepEqual';

  const props = defineProps({
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

  /**
   * @argument {HTMLElement} lst
   * @returns {Number} list height in px
   */
  function getListHeight(lst) {
    const getStyle = window.getComputedStyle;
    const len = lst.children.length;

    if (len == 0) {
      console.error('SimpleMenu: nested list length == 0!');
      return 0;
    }

    if (lst.children.length == 1) {
      return parseFloat(getStyle(lst.children[0])['height']);
    }

    const height = parseFloat(getStyle(lst.children[0])['height']);
    const marginTop = parseFloat(getStyle(lst.children[1])['marginTop']);
    return height * len + marginTop * (len - 1);
  }

  function setInnerButtonsTabIndex(lst, idx) {
    const buttons = lst.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; ++i)
      buttons[i].tabIndex = idx;
  }

  function expandList(lst) {
    lst.style.height = getListHeight(lst).toString() + 'px';
    lst.style.opacity = '1';
    lst.style.marginTop = '0.5em';
    setInnerButtonsTabIndex(lst, 0);
  }

  function collapseList(lst) {
    lst.style.height = '0';
    lst.style.opacity = '0';
    lst.style.marginTop = '0';

    setInnerButtonsTabIndex(lst, -1);
  }

  function activateTop(idx, preserve) {
    if (props.options[idx].children) {
      const lst = getList(idx);
      if (!lst) {
        console.error(`list with index ${idx} does not exist`);
        return;
      }

      // If the index is different, then we open another sub-list. Otherwise,
      // just close currently opened list by setting openedTopIdx to undefined.
      if (openedTopIdx.value === idx && !preserve) {
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

    const key = props.options[openedTopIdx.value].children[idx].key;
    if (key !== props.active)
      emit('update:value', key);
  }

  // Find an index of a top-level option corresponding to an active sub-option.
  // This is needed to automatically open the list of options on menu remount.
  const subItemTopIdx = computed(() => {
    for (let i = 0; i < props.options.length; ++i) {
      const opt = props.options[i];
      if (!opt.children)
        continue;

      if (props.active === opt.key)
        return undefined;

      for (const child of opt.children)
        if (props.active === child.key)
          return i;
    }
  });

  const hasIcon = computed(() => {
    for (let i of props.options) {
      if (i.icon) {
        return true;
      }
      if (i.children) {
        for (let j of i.children) {
          if (j.icon) {
            return true;
          }
        }
      }
    }
    return false;
  });

  function areDifferentItems(a, b) {
    if (!a ^ !b) {
      // If either a or b is null. Detects the case when the length of old
      // options was shorter or longer than the length of the new options.
      return true;
    }

    return !deepEqual(a, b, new Set(['label']));
  }

  watch(() => props.options, (newValue, oldValue) => {
    // Open the corresponding nested key if the key was known before the
    // options. Useful in asyncronous environment, when the key is already
    // assigned, but the menu options are still awaited from the server.
    if (openedTopIdx.value === undefined) {
      nextTick(() => {
        const topIdx = subItemTopIdx.value;
        if (topIdx !== undefined)
          activateTop(topIdx);
      });

      return;
    }

    // Recalculate nested list's height to match the case when the amount
    // of nested options is changed.
    nextTick(() => {
      if (openedTopIdx.value !== undefined) {
        const lst = getList(openedTopIdx.value);
        const height = getListHeight(lst).toString() + 'px';
        lst.style.height = height;
      }
    })

    // Close the nested list if the corresponding option (or previous option)
    // was removed. In this case option indexes are shifted back, and
    // openedTopIdx may match another option that previously was ahead.
    if (areDifferentItems(
          newValue[openedTopIdx.value], oldValue[openedTopIdx.value])) {
      collapseList(getList(openedTopIdx.value));
      openedTopIdx.value = undefined;
      return;
    }
  });

  watch(() => props.active, () => {
    const topIdx = subItemTopIdx.value;
    window.console.log(`===!!!=== SimpleMenu: active: ${props.active}, topIdx: ${topIdx}`);
    if (topIdx !== undefined)
      activateTop(topIdx, true);
  }, { immediate: true });
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
  position: relative;
  display: flex;
  gap: 0 0.7em;
  align-items: center;
  width: 100%;
  padding: 1em;
  border-radius: 0.3em;

  color: var(--menu-color, var(--menu-default-color));
  transition: 0.2s;
}

.menu-button-inner-border {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 0.3em;
  pointer-events: none;
  background-color: transparent;
  border: 1px solid var(--menu-active-bg-color,
    var(--menu-default-active-bg-color));
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.menu-button:focus .menu-button-inner-border {
  opacity: 1;
}

.menu-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1em;
  height: 1em;
  overflow: hidden;
}

.menu-arrow {
  margin-top: 0.1em;
  margin-left: auto;
  height: 0.4em;
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
  height: 0;
  opacity: 0;
  overflow: hidden;
  transition: opacity 0.7s, all 0.3s;

  background-color: var(--menu-nested-list-bg-color,
    var(--menu-default-nested-list-bg-color));
}

</style>
