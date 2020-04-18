<template>
  <div id="app">
    <Headers />
    <Navs />
    <keep-alive>
      <router-view />
    </keep-alive>
    <Player></Player>
  </div>
</template>

<script>
import Headers from "./components/Headers.vue";
import Navs from "./components/Navs.vue";
import Player from "./components/Player";
export default {
  components: {
    Headers,
    Navs,
    Player,
  },
};
</script>

<style lang="stylus"></style>
