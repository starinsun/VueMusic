<template>
  <div class="progress-bar" ref="bar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-bar-wrapper">
        <div
          class="progress-btn"
          ref="btn"
          @touchstart.prevent="ptouchStart"
          @touchmove.prevent="ptouchMove"
          @touchend="ptouchEnd"
        ></div>
      </div>
    </div>
  </div>
</template>
@touchstart="ptouchStart" @touchmove="ptouchMove" @touchend="ptouchEnd"
<script>
import { watch, ref } from "@vue/composition-api";
const BALL_WIDTH = 16;

export default {
  props: {
    percent: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const touch = {};
    const bar = ref(null);
    const progress = ref(null);
    const btn = ref(null);
    watch(
      () => props.percent,
      (newP) => {
        if (newP >= 0 && !touch.init) {
          const barWidth = bar.value.clientWidth - BALL_WIDTH;
          const offsetWidth = newP * barWidth;
          _offsetW(offsetWidth);
        }
      },
      { lazy: true }
    );
    function ptouchStart(e) {
      touch.init = true;
      touch.startX = e.touches[0].pageX;
      touch.left = progress.value.clientWidth;
    }
    function ptouchMove(e) {
      if (!touch.init) return;
      const deltaX = e.touches[0].pageX - touch.startX;
      const offsetWidth = Math.min(
        bar.value.clientWidth - BALL_WIDTH,
        Math.max(0, touch.left + deltaX)
      );
      _offsetW(offsetWidth);
    }
    function ptouchEnd() {
      touch.init = false;
      _triggerPercent();
    }
    function progressClick(e) {
      _offsetW(e.offsetX);
      _triggerPercent();
    }
    function _triggerPercent() {
      const barWidth = bar.value.clientWidth - BALL_WIDTH;
      const percent = progress.value.clientWidth / barWidth;
      emit("percentChange", percent);
    }
    function _offsetW(offsetWidth) {
      progress.value.style.width = `${offsetWidth}px`;
      btn.value.style["transform"] = `translate3d(${offsetWidth}px,0,0)`;
    }
    return {
      bar,
      progress,
      btn,
      ptouchMove,
      ptouchStart,
      ptouchEnd,
      progressClick,
    };
  },
};
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/variable";

.progress-bar
  height 30px
  .bar-inner
    position relative
    top 13px
    height 4px
    background rgba(0, 0, 0, 0.3)
    .progress
      position absolute
      height 100%
      background $color-theme
    .progress-bar-wrapper
      position absolute
      left -8px
      top -13px
      width 30px
      height 30px
      .progress-btn
        position relative
        top 7px
        left 7px
        box-sizing border-box
        width 16px
        height 16px
        border 3px solid $color-text
        border-radius 50%
        background $color-theme
</style>
