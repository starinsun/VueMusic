<template>
  <div class="song-list">
    <ul>
      <li
        @click="selectItem(song, idx)"
        v-for="(song, idx) in songs"
        class="item"
        :key="song.id"
      >
        <div class="rank" v-show="rank">
          <span class="text">{{ idx + 1 }}</span>
        </div>
        <div class="content">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
    <Loading v-show="isShow"></Loading>
  </div>
</template>

<script>
import Loading from "../ui/loading";
import { computed } from "@vue/composition-api";
export default {
  props: {
    songs: {
      type: Array,
      default: () => [],
    },
    rank: {
      type: Boolean,
      default: false,
    },
    noneed: {
      type: Boolean,
      default: false,
    },
  },
  components: { Loading },
  setup(props, { emit }) {
    function getDesc(song) {
      return `${song.singer[0].name} · ${song.album.name} · ${song.name}`;
    }
    function selectItem(song, idx) {
      emit("select", song, idx);
    }
    const isShow = computed(() => {
      if (props.noneed === false) {
        return !props.songs.length;
      } else {
        return false;
      }
    });
    return { getDesc, selectItem, isShow };
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../assets/stylus/variable";

.song-list
  .item
    display: flex
    align-items: center
    box-sizing: border-box
    height: 64px
    font-size: $font-size-medium
    .rank
      flex: 0 0 25px
      width: 25px
      margin-right: 30px
      text-align: center
      .text
        color: $color-theme
        font-size: $font-size-large
    .content
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        color: $color-text
      .desc
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        margin-top: 4px
        color: $color-text-d
</style>
