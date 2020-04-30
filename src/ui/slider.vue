<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        v-for="(dot, index) in dots.value"
        :key="index"
        :class="{ active: currentPage === index }"
      ></span>
    </div>
  </div>
</template>

<script>
import {
  onMounted,
  ref,
  reactive,
  onBeforeUnmount,
} from "@vue/composition-api";
import Bscroll from "better-scroll";

export default {
  setup(_, { root }) {
    const sliderGroup = ref(null);
    const slider = ref(null);
    const currentPage = ref(0);
    const dots = reactive({ name: "dots", value: [] });
    let bscroll = {},
      timer = null;

    onMounted(() => {
      //TODO:这里是用来在下一次渲染后设置slider的样式，初始化滚动方法
      root.$nextTick(() => {
        _setSliderWidth();
        _initDots();
        _initSlider();
        _autoPlay();
      });
      window.addEventListener("resize", () => {
        _setSliderWidth(true);
      });
    });
    onBeforeUnmount(() => {
      clearTimeout(timer);
    });

    function _setSliderWidth(isRest) {
      let children = sliderGroup.value.children;
      let width = slider.value.clientWidth;
      for (let i = 0; i < children.length; i++) {
        children[i].classList.add("slider-item");
        children[i].style.width = width + "px";
      }
      //FIXME:这里留出了左右两边的DOM宽度，如3个图片，最终是5个宽度
      if (!isRest) {
        sliderGroup.value.style.width = width * (children.length + 2) + "px";
      } else {
        sliderGroup.value.style.width = width * children.length + "px";
      }
    }
    function _initSlider() {
      bscroll = new Bscroll(slider.value, {
        scrollX: true,
        scrollY: true,
        momentum: false,
        click: true,
        snap: {
          loop: true,
          threshold: 0.3,
          speed: 400,
        },
      });
      bscroll.on("scrollEnd", () => {
        let pageIdx = bscroll.getCurrentPage().pageX;
        currentPage.value = pageIdx;
        _autoPlay();
      });
    }
    function _initDots() {
      dots.value = new Array(sliderGroup.value.children.length);
    }
    function _autoPlay() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        //FIXME:这里有个问题，之前使用页码来触发，导致最后一张无法转到前一张
        bscroll.next();
      }, 2333);
    }
    return { sliderGroup, slider, dots, currentPage };
  },
};
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/variable";
.slider
  min-height 1px
  position relative
  .slider-group
    position relative
    overflow hidden
    white-space nowrap
    .slider-item
      float: left
      box-sizing: border-box
      overflow: hidden
      text-align: center
      a
        display: block
        width: 100%
        overflow: hidden
      img
        display: block
        width: 100%
  .dots
    position: absolute
    right: 0
    left: 0
    bottom: 10px
    text-align: center
    .dot
      display: inline-block
      margin: 0 4px
      width: 8px
      height: 8px
      border-radius: 50%
      background: $color-text-l
      &.active
        width: 15px
        border-radius: 5px
        background: $color-text-ll
</style>
