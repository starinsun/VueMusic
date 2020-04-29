<template>
  <Scroll
    class="suggest"
    :data="list"
    :pullup="pullup"
    @scrollToEnd="searchMore"
    ref="sug"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in list" :key="item.mid">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getListName(item)"></p>
        </div>
      </li>
      <Loading v-show="hasMore"></Loading>
    </ul>
  </Scroll>
</template>

<script>
import {
  watch,
  reactive,
  toRefs,
  ref,
  onBeforeUnmount,
} from "@vue/composition-api";
import { getSearchRes } from "../api/search";
import Scroll from "../ui/scroll";
import Loading from "../ui/loading";

const LIMIT = 20;

export default {
  props: {
    query: {
      type: String,
      default: "",
    },
  },
  components: {
    Scroll,
    Loading,
  },
  setup(props) {
    let timer = null;
    //防抖的定义要拿出来定义，不然会报错
    const debouceSearch = _debouce(_search, 500);
    const sug = ref(null);
    const suggest = reactive({
      page: 1,
      list: [],
      pullup: true,
      hasMore: true,
    });
    function getListName(item) {
      return `${item.name} · ${item.singer[0].name} ${
        item.singer[1] ? "& " + item.singer[1].name : ""
      }`;
    }
    function searchMore() {
      if (!suggest.hasMore) return;
      suggest.page++;
      getSearchRes(props.query, suggest.page, LIMIT).then((res) => {
        suggest.list = [...suggest.list, ...res];
        _checkMore(res);
      });
    }
    function _search(key, page, limit) {
      suggest.hasMore = true;
      suggest.page = 1;
      suggest.list = [];
      sug.value.scrollTo(0, 0);
      getSearchRes(key, page, limit).then((res) => {
        suggest.list = res;
        _checkMore(res);
      });
    }
    function _checkMore(res) {
      const song = res.data;
      if (!res.length || song.curnum + song.curpage * LIMIT > song.totalnum) {
        suggest.hasMore = false;
      }
    }
    function _debouce(fn, delay) {
      timer = null;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(this, args);
        }, delay);
      };
    }
    onBeforeUnmount(() => {
      clearTimeout(timer);
    });
    watch(
      () => props.query,
      (newQ) => {
        if (newQ === "") return;
        debouceSearch(props.query, suggest.page, LIMIT);
      }
    );
    return {
      sug,
      ...toRefs(suggest),
      getListName,
      searchMore,
    };
  },
};
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/variable.styl";

.suggest
  height: 100%
  overflow: hidden
  .suggest-list
    padding: 0 30px
    .suggest-item
      display: flex
      align-items: center
      padding-bottom: 20px
    .icon
      flex: 0 0 30px
      width: 30px
      [class^="icon-"]
        font-size: 16px
        color: $color-text-d
    .name
      flex: 1
      font-size: 15px
      color: $color-text-d
      overflow: hidden
      .text
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
  .no-result-wrapper
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
