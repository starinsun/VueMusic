<template>
  <transition name="slide-fade">
    <div class="singer-detail">
      <div>1</div>
      <ul>
        <li v-for="song in songs.val" :key="song.id">
          <span>{{ song.name }}</span>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
import { onMounted, computed, reactive } from "@vue/composition-api";
import { SET_SINGER_SONGS } from "../store/constant";

export default {
  setup(_, { root }) {
    const store = root.$store;
    const router = root.$options.router;
    const singer = computed(() => store.getters.singer);
    const songs = reactive({ val: [] });
    onMounted(() => {
      if (!singer.value.singer_mid) router.push("/singer");
      else {
        store.dispatch(SET_SINGER_SONGS, singer.value.singer_mid).then(() => {
          songs.val = store.getters.songs;
        });
      }
    });
    return { singer, songs };
  }
};
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/variable.styl";

.singer-detail
  position fixed
  z-index 100
  top 0
  left 0
  right 0
  bottom 0
  background $color-background

.slide-fade-enter-active
  transition: all .3s .3s ease

.slide-fade-leave-active
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0)
// 这里的进场动画为什么不生效？
.slide-fade-enter, .slide-fade-leave-to
  transform: translateX(10px)
  opacity: 0
</style>
