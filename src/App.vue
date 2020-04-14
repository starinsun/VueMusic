<template>
  <div id="app">
    <Headers />
    <Navs />
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import Headers from "./components/Headers.vue";
import Navs from "./components/Navs.vue";
export default {
  components: {
    Headers,
    Navs,
  },
};
</script>

<style lang="stylus"></style>
