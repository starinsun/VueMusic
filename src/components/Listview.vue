<template>
  <Scroll
    class="listview"
    :data="data"
    ref="listview"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll"
  >
    <ul v-show="data.length">
      <li
        v-for="(arr, idx) in singerTag"
        class="list-group"
        :key="arr[0]"
        ref="listgroup"
      >
        <h2 class="list-group-title">{{ arr[0] }}</h2>
        <ul>
          <li
            v-for="item in data[idx]"
            :key="item.singer_id"
            class="list-group-item"
            @click="selectItem(item)"
          >
            <img v-lazy="item.singer_pic" class="avatar" />
            <span class="name">{{ item.singer_name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart="onTagTouchStart"
      @touchmove.stop.prevent="onTagTouchMove"
    >
      <ul>
        <li
          v-for="(item, idx) in tagList"
          class="item"
          :class="{ current: scrollData.currentIdx === idx }"
          :key="idx"
          :data-index="idx"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="listfixed">
      <h1 class="fixed-title">
        {{ fixedTitle }}
      </h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <Loading></Loading>
    </div>
  </Scroll>
</template>

<script>
import Scroll from "../ui/scroll";
import Loading from "../ui/loading";
import { singerTag } from "../api/singer";
import { computed, ref, reactive, watch } from "@vue/composition-api";

export default {
  props: {
    data: {
      type: Array,
      default: null,
    },
  },
  components: { Scroll, Loading },
  setup(props, { root, emit }) {
    const listview = ref(null);
    const listgroup = ref(null);
    const listfixed = ref(null);
    const scrollData = reactive({
      scrollY: -1,
      currentIdx: 0,
    });
    const tagList = computed(() => singerTag.map((item) => item[0]));
    const fixedTitle = computed(() => {
      if (scrollData.scrollY > 0) return "";
      return props.data[scrollData.currentIdx]
        ? singerTag[scrollData.currentIdx][0]
        : "";
    });
    let touch = {},
      ARCHOR_HEIGHT = 24,
      listenScroll = true,
      listHeight = [],
      probeType = 3;
    function onTagTouchStart(e) {
      let idx = e.target.getAttribute("data-index");
      let firstTouch = e.touches[0];
      touch.y1 = firstTouch.pageY;
      touch.idx = idx;
      _scrollTo(idx);
    }
    function onTagTouchMove(e) {
      let firstTouch = e.touches[0];
      touch.y2 = firstTouch.pageY;
      let delta = ((touch.y2 - touch.y1) / ARCHOR_HEIGHT) | 0;
      let idx = +touch.idx + delta;
      _scrollTo(idx);
    }
    function refresh() {
      listview.value.refresh();
    }
    function scroll(pos) {
      scrollData.scrollY = pos.y;
    }
    function _scrollTo(idx) {
      listview.value.scrollToElement(listgroup.value[idx], 0);
    }
    function _calculateHeight() {
      listHeight = [];
      const list = listgroup.value;
      let height = 0;
      listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        listHeight.push(height);
      }
    }
    // 只是去派发事件，并不涉及任何逻辑
    function selectItem(item) {
      emit("select", item);
    }
    watch(
      () => props.data,
      () => {
        // FIXED:原来是data不能解构，否则会报错
        root.$nextTick(() => {
          _calculateHeight();
        });
      }
    );
    watch(
      () => scrollData.scrollY,
      (newY) => {
        for (let i = 0; i < listHeight.length - 1; i++) {
          if (newY > 0) {
            scrollData.currentIdx = 0;
            return;
          }
          let h1 = listHeight[i],
            h2 = listHeight[i + 1];
          if (-newY >= h1 && -newY < h2) {
            scrollData.currentIdx = i;
            return;
          }
        }
      }
    );
    return {
      singerTag,
      tagList,
      listview,
      onTagTouchStart,
      onTagTouchMove,
      listgroup,
      listfixed,
      listenScroll,
      scroll,
      scrollData,
      probeType,
      fixedTitle,
      selectItem,
      refresh,
    };
  },
};
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/variable";

.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $color-background
  .list-group
    padding-bottom: 30px
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 25px
      font-size: $font-size-medium
      color: $color-text-l
      background: $color-highlight-background
    .list-group-item
      display: flex
      align-items: center
      padding: 20px 0 0 30px
      .avatar
        width: 50px
        height: 50px
        border-radius: 50%
      .name
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 50px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .item
      padding: 6px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 25px
      font-size: $font-size-medium
      color: $color-text-l
      background: $color-highlight-background
  .loading-container
    position: absolute
    width: 100%
    top: 40%
    transform: translateY(-50%)
</style>
