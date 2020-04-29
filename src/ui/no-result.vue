<template>
  <div class="no-result">
    <p class="no-result-text">遗憾~没有结果~</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/variable.styl";

  .no-result
    text-align: center
    .no-result-text
      margin-top: 30px
      font-size: $font-size-medium
      color: $color-text-d
</style>
