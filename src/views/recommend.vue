<template>
  <div class="recommend">
    <Scroll ref="scroll" class="scroll-provider" :data="songList.val">
      <!-- 为什么会有div，上面那个我们限制了一个高度700，下面这个就是整个的高度2000，这样才能滚动 -->
      <div>
        <div v-if="bannerList.val.length" class="slider-warpper">
          <Slider>
            <section v-for="banner in bannerList.val" :key="banner.album_id">
              <a :href="banner.jumpurl">
                <img @load="getimg" :src="banner.picurl" />
              </a>
            </section>
          </Slider>
        </div>
        <div class="songListTitle">\ 推荐歌单 /</div>
        <ul class="songList">
          <li v-for="song in songList.val" :key="song.dissid">
            <div class="icon">
              <img
                v-lazy="song.imgurl"
                :alt="song.dissname"
                width="133"
                height="133"
              />
            </div>
            <div class="text">
              <h1 class="desc" v-html="song.dissname"></h1>
              <p class="listenNum">播放数：{{ getCount(song.listennum) }}</p>
            </div>
          </li>
        </ul>
      </div>
      <Loading v-show="!songList.val.length" class="loading-container" />
    </Scroll>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "@vue/composition-api";
import { getRecommendBanner, getSongList } from "../api/recommend";
import Slider from "../ui/slider";
import Scroll from "../ui/scroll";
import Loading from "../ui/loading";
import { getCount } from "../util.js";

export default {
  name: "Home",
  components: { Slider, Scroll, Loading },
  setup() {
    const bannerList = reactive({ name: "bannerList", val: [] });
    const songList = reactive({ name: "songList", val: [] });
    const scroll = ref(null);
    const hasGotImg = ref(false);
    onMounted(() => {
      getRecommendBanner().then(v => {
        bannerList.val = v;
      });
      getSongList().then(v => {
        songList.val = v;
      });
    });
    function getimg() {
      //FIXME:当我们判断图片已经加载时，重新刷新拿到最新高度，只判断一次即可
      if (!hasGotImg.value) scroll.value.refresh();
      hasGotImg.value = true;
    }
    return {
      bannerList,
      songList,
      getCount,
      getimg,
      scroll
    };
  }
};
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/variable";

.recommend
  position fixed
  width 100%
  top 88px
  bottom  0
  .scroll-provider
    height 100%
    overflow hidden
    .songListTitle
      height 40px
      color $color-theme-d
      display flex
      justify-content center
      align-items flex-end
      &::before
        content '————'
        color $color-theme-d
      &::after
        content '————'
    .songList
      display grid
      grid-template-columns 1fr 1fr
      .icon,.text
        display grid
        justify-items  center
        font-size 12px
        margin 12px 0 0 0
        color $color-theme-d
        .desc
          text-overflow ellipsis
          text-align center
          overflow hidden
          white-space nowrap
          margin-bottom 5px
          width 90%
        .listenNum
          color $color-text-d
    .loading-container
      position: absolute
      width: 100%
      top: 40%
      transform: translateY(-50%)
</style>
