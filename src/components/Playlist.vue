<template>
  <transition name="list-fade">
    <div class="playlist" v-show="show" @click="onHide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text">播放列表</span>
            <span class="clear" @click="showConfirm"
              ><i class="icon-clear"></i
            ></span>
          </h1>
        </div>
        <Scroll ref="listContent" :data="sequenceList" class="list-content">
          <transition-group name="list" tag="ul">
            <li
              ref="listItem"
              class="item"
              @click="selectItem(item, idx)"
              v-for="(item, idx) in sequenceList"
              :key="item.mid"
            >
              <i class="current" :class="getCurCls(item)"></i>
              <span class="text">{{ item.name }}</span>
              <span class="like" @click.stop="toggleFavor(item)">
                <i :class="getFavorIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </Scroll>
        <div class="list-close" @click="onHide">
          <span>关闭</span>
        </div>
      </div>
      <Confirm @confirm="clearList" ref="confirm" text="是否清空列表"></Confirm>
    </div>
  </transition>
</template>

<script>
import { reactive, toRefs, computed, ref, watch } from "@vue/composition-api";
import Scroll from "../ui/scroll";
import Confirm from "../ui/confirm";
import { SET_CURRENT_IDX, SET_PLAYING_STATE } from "../store/constant";

export default {
  components: { Scroll, Confirm },
  setup(_, { root }) {
    const store = root.$store;
    const listContent = ref(null);
    const listItem = ref(null);
    const confirm = ref(null);
    const playlist = reactive({
      show: false,
    });
    const sequenceList = computed(() => store.getters.sequenceList);
    const currentSong = computed(() => store.getters.currentSong);
    const mode = computed(() => store.getters.mode);
    const playList = computed(() => store.getters.playList);
    function onShow() {
      playlist.show = true;
      root.$nextTick(() => {
        listContent.value.refresh();
        scrollToCurrent(currentSong.value);
      });
    }
    function onHide() {
      playlist.show = false;
    }
    function getCurCls(item) {
      if (currentSong.value.mid === item.mid) return "icon-play";
      return "";
    }
    function selectItem(item, idx) {
      if (mode.value === 2) {
        idx = playList.value.findIndex((song) => song.mid === item.mid);
      }
      store.commit(SET_CURRENT_IDX, idx);
      store.commit(SET_PLAYING_STATE, true);
    }
    function scrollToCurrent(cur) {
      const idx = sequenceList.value.findIndex((song) => song.mid === cur.mid);
      listContent.value.scrollToElement(listItem.value[idx], 300);
    }
    function deleteOne(item) {
      store.dispatch("deleteSong", item);
      if (!playList.value.length) onHide();
    }
    function showConfirm() {
      confirm.value.onShow();
    }
    function clearList() {
      store.dispatch("deleteAll");
      onHide();
    }
    function getFavorIcon(item) {
      return _isFavor(item) ? "icon-favorite" : "icon-not-favorite";
    }
    function toggleFavor(item) {
      _isFavor(item)
        ? store.dispatch("deleteFavor", item)
        : store.dispatch("saveFavor", item);
    }
    function _isFavor(item) {
      const idx = store.getters.favor.findIndex(
        (song) => song.mid === item.mid
      );
      return idx > -1;
    }
    watch(
      () => currentSong.value,
      (newS, oldS) => {
        if (!playlist.show || newS.mid === oldS.mid) {
          return;
        }
        scrollToCurrent(newS);
      }
    );
    return {
      ...toRefs(playlist),
      onShow,
      onHide,
      sequenceList,
      listContent,
      getCurCls,
      selectItem,
      listItem,
      deleteOne,
      confirm,
      showConfirm,
      clearList,
      getFavorIcon,
      toggleFavor,
    };
  },
};
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/variable";

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            text-overflow: ellipsis
            overflow: hidden
            white-space: nowrap
            font-size: $font-size-medium
            color: $color-text-d
          .like
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            font-size: $font-size-small
            color: $color-theme
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
