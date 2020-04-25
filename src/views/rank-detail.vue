<template>
  <transition name="slide">
    <Musiclist :rank="true" :title="title" :bg-image="bgImage" :songs="songs.val"></Musiclist>
  </transition>
</template>

<script>
  import Musiclist from "../components/Musiclist";
  import {computed, onMounted,reactive} from '@vue/composition-api'
  import {getRankDetail} from "../api/rank";

  export default {
    components: {Musiclist},
    setup(_, {root}){
      const store = root.$store, router = root.$router
      const songs = reactive({val:[]})
      const rank = computed(()=>store.getters.rank)
      const title = computed(() =>rank.value.topTitle)
      const bgImage = computed(()=>{
        if(songs.val.length) {
          return songs.val[0].img
        } else {
          return rank.value.picUrl
        }
      })
      onMounted(() => {
        if (!rank.value.id) router.push("/rank");
        else {
          getRankDetail(rank.value.id).then((v) => {
            songs.val = v;
          });
        }
      });
      return {
        title,
        bgImage,
        songs,
        rank
      }
    }
  }
</script>

<style scoped lang="stylus">
@import "../assets/stylus/variable.styl";

.slide-enter-active .slide-leave-active
  transition all 0.3s ease
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>