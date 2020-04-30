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
  components: { Musiclist },
  setup(_, { root }) {
    const store = root.$store;
    const router = root.$router;
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
