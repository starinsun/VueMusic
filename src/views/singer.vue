<template>
  <div class="singer" ref="singer">
    <ListView
      ref="listview"
      @select="selectSinger"
      :data="list.singerList"
    ></ListView>
    <router-view></router-view>
  </div>
</template>

<script>
import {
  reactive,
  onMounted,
  onActivated,
  watch,
  computed,
  ref,
} from "@vue/composition-api";
import { getSingerList } from "../api/singer";
import ListView from "../components/Listview";
import { SET_SINGER } from "../store/constant";

export default {
  name: "singer",
  components: { ListView },
  setup(_, { root }) {
    const store = root.$store,
      router = root.$router;
    const list = reactive({ singerList: [] });
    const singer = ref(null);
    const listview = ref(null);
    const playList = computed(() => store.getters.playList);
    onMounted(() => {
      getSingerList().then((res) => {
        list.singerList = res;
      });
      _handlePlayList(playList.value);
    });
    onActivated(() => {
      _handlePlayList(playList.value);
    });
    function _handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? "55px" : "";
      singer.value.style.bottom = bottom;
      listview.value.refresh();
    }
    function selectSinger(singer) {
      store.commit(SET_SINGER, singer);
      router.push({
        path: `/singer/${singer.singer_mid}`,
      });
    }
    watch(
      () => playList.value,
      (newV) => {
        _handlePlayList(newV);
      },
      { lazy: true }
    );
    return { list, selectSinger, singer, listview };
  },
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
