<template>
  <div class="about">
    <Loading />
    <h1>This is an rank page</h1>
  </div>
</template>

<script>
import Loading from "../ui/loading";
export default {
  components: { Loading },
};
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/variable.styl";
h1
  color $color-theme
</style>
