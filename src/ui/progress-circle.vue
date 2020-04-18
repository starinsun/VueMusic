<template>
  <div class="progress-circle">
    <svg
      :width="radius"
      :height="radius"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="progress-background"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
      />
      <circle
        class="progress-bar"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        :stroke-dasharray="dasharray.val"
        :stroke-dashoffset="dashoffset"
      />
    </svg>
    <slot></slot>
  </div>
</template>

<script>
import { reactive, computed } from "@vue/composition-api";
const PI = Math.PI;
export default {
  props: {
    radius: {
      type: Number,
      default: 100,
    },
    percent: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const dasharray = reactive({
      val: PI * 100,
    });
    const dashoffset = computed(() => (1 - props.percent) * dasharray.val);
    return {
      dasharray,
      dashoffset,
    };
  },
};
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/variable";

.progress-circle
  position: relative
  circle
    stroke-width: 8px
    transform-origin: center
    &.progress-background
      transform: scale(0.9)
      stroke: $color-theme-d
    &.progress-bar
      transform: scale(0.9) rotate(-90deg)
      stroke: $color-theme
</style>
