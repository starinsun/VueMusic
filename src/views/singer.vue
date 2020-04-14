<template>
  <div class="singer">
    <ListView @select="selectSinger" :data="list.singerList"></ListView>
    <router-view></router-view>
  </div>
</template>

<script>
import { reactive, onMounted } from "@vue/composition-api";
import { getSingerList } from "../api/singer";
import ListView from "../components/Listview";
import { SET_SINGER } from "../store/constant";

export default {
  name: "singer",
  components: { ListView },
  setup(_, { root }) {
    const list = reactive({ singerList: [] });
    onMounted(() => {
      getSingerList().then(res => {
        list.singerList = res;
      });
    });
    function selectSinger(singer) {
      root.$store.commit(SET_SINGER, singer);
      root.$options.router.push({
        path: `/singer/${singer.singer_mid}`
      });
    }
    return { list, selectSinger };
  }
};
</script>
<style lang="stylus" scoped>
@import "../assets/stylus/variable.styl";
.singer
  position fixed
  top 88px
  bottom 0
  width 100%
</style>
