<template>
  <transition name="slide-fade">
    <Musiclist :songs="songs.val" :title="title" :bgImage="bgImage"></Musiclist>
  </transition>
</template>

<script>
import { onMounted, computed, reactive } from "@vue/composition-api";
import Musiclist from "../components/Musiclist";
import { getSingerDetail } from "../api/singer";

export default {
  name: "singer-detail",
  components: { Musiclist },
  // 使用Vuex，结果不对头
  // setup(_, { root }) {
  //   const store = root.$store;
  //   const router = root.$options.router;
  //   const singer = computed(() => store.getters.singer);
  //   const songs = computed(() => store.getters.songs);
  //   const title = computed(() => store.getters.singer.singer_name);
  //   const bgImage = computed(() => store.getters.singer.singer_pic);
  //   onMounted(() => {
  //     if (!singer.value.singer_mid) router.push("/singer");
  //     else {
  //       store.dispatch(SET_SINGER_SONGS, singer.value.singer_mid);
  //     }
  //   });
  //   return { singer, songs, title, bgImage };
  // }
  setup(_, { root }) {
    const store = root.$store;
    const router = root.$options.router;
    const singer = computed(() => store.getters.singer);
    const title = computed(() => store.getters.singer.singer_name);
    const bgImage = computed(() => store.getters.singer.singer_pic);
    const songs = reactive({ val: [] });
    onMounted(() => {
      if (!singer.value.singer_mid) router.push("/singer");
      else {
        getSingerDetail(singer.value.singer_mid).then((v) => {
          songs.val = v;
        });
      }
    });
    return { singer, songs, title, bgImage };
  },
};
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/variable.styl";

.slide-fade-enter-active
  transition: all .3s .3s ease

.slide-fade-leave-active
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0)
// 这里的进场动画为什么不生效？
.slide-fade-enter, .slide-fade-leave-to
  transform: translateX(10px)
  opacity: 0
</style>
