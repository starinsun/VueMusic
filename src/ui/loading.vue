<template>
  <div class="wrap">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <span> 拼命加载中...</span>
  </div>
</template>

<script>
export default {};
</script>

<style lang="stylus">
@import "../assets/stylus/variable";

.wrap
  height 16px
  width 100%
  margin 10px auto
  text-align center
  font-size 14px
  >div
    display inline-block
    background-color $color-theme
    height 100%
    width 2px
    margin-right 3px
    animation load 1s infinite
  >div:nth-child(2)
    animation-delay -0.4s
  >div:nth-child(3)
    animation-delay -0.6s
  >div:nth-child(4)
    animation-delay -0.5s
  >div:nth-child(5)
    animation-delay -0.2s
  span
    color $color-theme
  @keyframes load
    0%,40%,100%
      transform scaleY(0.4)
      transform-origin center 100%
    20%
      transform scaleY(1)
</style>
