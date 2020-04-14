<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import Bscroll from "better-scroll";
import { onMounted, ref, watch } from "@vue/composition-api";
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { root, emit }) {
    const wrapper = ref(null);
    let scroll = null;
    onMounted(() => {
      root.$nextTick(() => {
        _initScroll();
      });
    });
    watch(
      () => props.data,
      () => {
        root.$nextTick(() => {
          refresh();
        });
      }
    );

    function _initScroll() {
      if (!wrapper.value) return;
      scroll = new Bscroll(wrapper.value, {
        probeType: props.probeType,
        click: props.click
      });
      if (props.listenScroll) {
        scroll.on("scroll", pos => {
          emit("scroll", pos);
        });
      }
    }
    // function _enable() {
    //   scroll && scroll.enable();
    // }
    // function _disable() {
    //   scroll && scroll.disable();
    // }
    function scrollTo(...args) {
      scroll && scroll.scrollTo(...args);
    }
    function scrollToElement(...args) {
      scroll && scroll.scrollToElement(...args);
    }
    function refresh() {
      scroll && scroll.refresh();
    }
    //TODO:这些东西都会被暴露出去，在父类中拿到Vue Component就可以收到这个方法
    //这样是不是增加了组件通讯发方式呢？
    return { ref, wrapper, refresh, scrollTo, scrollToElement };
  }
};
</script>
