<template>
  <div class="m-header">
    <div class="icon"></div>
    <div class="text">Vue-Music</div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/variable";
  .m-header
    display flex
    justify-content center
    align-items center
    height 44px
    .icon
      margin-top: 6px
      width: 32px
      height: 32px
      margin-right: 9px
      background-image url('../assets/image/default.png')
      background-size: 32px 32px
    .text
      color $color-theme
      font-size $font-size-large
</style>
