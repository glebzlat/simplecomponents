export default {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (ev) => {
      if (!(ev == ev.target || el.contains(ev.target)))
        binding.value(ev);
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  }
};
