<template>
  <div class="rank" ref="rankList">
    <Scroll :data="rank.lists" class="toplist" ref="topList">
      <ul>
        <li
          class="item"
          v-for="item in rank.lists"
          :key="item.id"
          @click="selectItem(item)"
        >
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl" />
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, idx) in item.songList" :key="idx">
              <span>{{ idx + 1 }} · </span>
              <span>{{ song.songname }} · {{ song.singername }} </span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!rank.lists.length">
        <Loading></Loading>
      </div>
    </Scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Loading from "../ui/loading";
import {
  onMounted,
  reactive,
  ref,
  computed,
  onActivated,
} from "@vue/composition-api";
import { getRankList } from "../api/rank";
import Scroll from "../ui/scroll";
import { SET_RANK } from "../store/constant";

export default {
  components: { Loading, Scroll },
  setup(_, { root }) {
    const store = root.$store;
    const router = root.$router;
    const rankList = ref(null);
    const topList = ref(null);
    const rank = reactive({
      lists: [],
    });
    const playList = computed(() => store.getters.playList);
    function _handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? "65px" : "";
      rankList.value.style.bottom = bottom;
      topList.value.refresh();
    }
    function selectItem(item) {
      router.push({
        path: `/rank/${item.id}`,
      });
      store.commit(SET_RANK, item);
    }
    onMounted(() => {
      getRankList().then((v) => {
        rank.lists = v;
      });
      _handlePlayList(playList.value);
    });
    onActivated(() => {
      _handlePlayList(playList.value);
    });
    return {
      rank,
      rankList,
      topList,
      selectItem,
    };
  },
};
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/variable.styl";

.rank
  position fixed
  width 100%
  top 88px
  bottom 0
  .toplist
    height 100%
    overflow hidden
    .item
      display flex
      margin 0 20px
      padding-top 20px
      height 100px
      &:last-child
        padding-bottom 20px
      .icon
        flex 0 0 100px
        width 100px
        height 100px
      .songlist
        flex 1
        display flex
        flex-direction column
        justify-content center
        padding 0 20px
        height 100px
        overflow hidden
        background $color-highlight-background
        color $color-text-ll
        font-size $font-size-small
        .song
          text-overflow ellipsis
          overflow hidden
          white-space nowrap
          line-height 26px
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
