<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="title">
        收藏夹
      </div>
      <div ref="playBtn" class="play-btn" @click="playAll">
        <i class="icon-play"></i>
        <span class="text">播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <Scroll ref="favoriteList" class="list-scroll" :data="favor">
          <div class="list-inner">
            <SongList
              :songs="favor"
              @select="selectItem"
              :noneed="isShow"
            ></SongList>
          </div>
        </Scroll>
      </div>
      <div class="no-result-wrapper" v-show="!favor.length">
        <no-result></no-result>
      </div>
      <div class="mengceng" @click="back"></div>
    </div>
  </transition>
</template>

<script>
import NoResult from "../ui/no-result";
import Scroll from "../ui/scroll";
import SongList from "./Songlist";
import {
  computed,
  onMounted,
  watch,
  onActivated,
  ref,
} from "@vue/composition-api";

export default {
  components: { NoResult, Scroll, SongList },
  setup(_, { root }) {
    const router = root.$router,
      store = root.$store,
      isShow = true;
    const listWrapper = ref(null);
    const favoriteList = ref(null);
    const favor = computed(() => store.getters.favor);
    function back() {
      router.go(-1);
    }
    function selectItem(item) {
      store.dispatch("insertSong", item);
    }
    function playAll() {
      store.dispatch("randomPlay", { list: favor.value });
    }
    const playList = computed(() => store.getters.playList);
    onMounted(() => {
      _handlePlayList(playList.value);
    });
    onActivated(() => {
      _handlePlayList(playList.value);
    });
    function _handlePlayList(list) {
      const bottom = list.length > 0 ? "60px" : "";
      listWrapper.value.style.bottom = bottom;
      favoriteList.value && favoriteList.value.refresh();
    }
    watch(
      () => playList.value,
      (newV) => {
        _handlePlayList(newV);
      },
      { lazy: true }
    );
    return {
      back,
      favor,
      selectItem,
      playAll,
      listWrapper,
      favoriteList,
      isShow,
    };
  },
};
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/variable";

.user-center
  position: fixed
  top: 0
  bottom: 0
  z-index: 100
  width: 75%
  background: $color-background
  &.slide-enter-active, &.slide-leave-active
    transition: all 0.3s
  &.slide-enter, &.slide-leave-to
    transform: translate3d(-100%, 0, 0)
  .back
    position absolute
    top: 0
    left: 6px
    z-index: 50
    .icon-back
      display: block
      padding: 10px
      font-size: $font-size-large-x
      color: $color-theme
  .title
    color: $color-text-l
    margin 15px 0
    text-align center
  .play-btn
    box-sizing: border-box
    width: 135px
    padding: 7px 0
    margin: 0 auto
    text-align: center
    border: 1px solid  $color-text-ll
    color: $color-text-l
    border-radius: 100px
    font-size: 0
    .icon-play
      display: inline-block
      vertical-align: middle
      margin-right: 6px
      font-size: $font-size-medium-x
    .text
      display: inline-block
      vertical-align: middle
      font-size: $font-size-small
  .list-wrapper
    position: absolute
    top: 88px
    bottom: 0
    width: 100%
    .list-scroll
      height: 100%
      overflow: hidden
      .list-inner
        padding: 20px 30px
  .no-result-wrapper
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
  .mengceng
    position fixed
    top 0
    bottom 0
    left 75%
    right 0
    filter blur(1px) opacity(0.5)
    background-color #000
</style>
