<template>
  <transition name="slide">
    <MusicList :title="title" :bgImage="bgImage" :songs="discs.val"></MusicList>
  </transition>
</template>

<script>
import MusicList from "../components/Musiclist";
import { reactive, computed, onMounted } from "@vue/composition-api";
import { getDiscList } from "../api/recommend";

export default {
  name: "discDetail",
  components: { MusicList },
  setup(_, { root }) {
    const store = root.$store,
      router = root.$router;
    const disc = computed(() => store.getters.disc);
    const title = computed(() => disc.value.dissname);
    const bgImage = computed(() => disc.value.imgurl);
    // 这里错用null的话，会导致后面问题很大
    const discs = reactive({ val: [] });
    onMounted(() => {
      if (!disc.value.dissid) router.push("/recommend");
      else {
        getDiscList(disc.value.dissid).then((v) => {
          discs.val = v;
        });
      }
    });
    return { disc, title, bgImage, discs };
  },
};
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/variable.styl";

.slide-enter-active
  transition: all .3s .3s ease

.slide-leave-active
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0)
// 这里的进场动画为什么不生效？
.slide-enter, .slide-leave-to
  transform: translateX(10px)
  opacity: 0
</style>
