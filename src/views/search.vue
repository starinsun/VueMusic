<template>
  <div class="search">
    <div class="search-box-wrapper">
      <SearchBox ref="searchBox" @query="onQueryChange"></SearchBox>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <Scroll class="shortcut" :data="shortcut" ref="searchScroll">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li
                @click="addQuery(item.k)"
                v-for="item in hotkey"
                :key="item.n"
                class="item"
              >
                <span>{{ item.k }}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <SearchList
              @delete="deleteQuery"
              @select="addQuery"
              :searches="searchHistory"
            ></SearchList>
          </div>
        </div>
      </Scroll>
    </div>
    <div ref="searchResWrapper" class="search-result" v-show="query">
      <Suggest ref="sugScroll" @select="saveSearch" :query="query"></Suggest>
    </div>
    <Confirm
      @confirm="clearHistory"
      ref="confirm"
      text="是否清空列表"
    ></Confirm>
  </div>
</template>

<script>
import SearchBox from "../ui/search-box";
import SearchList from "../ui/search-list";
import Suggest from "../components/Suggest";
import Confirm from "../ui/confirm";
import Scroll from "../ui/scroll";
import {
  onMounted,
  onActivated,
  reactive,
  toRefs,
  ref,
  computed,
  watch,
} from "@vue/composition-api";
import { getHotkey } from "../api/search";

export default {
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll,
  },
  setup(_, { root }) {
    const store = root.$store;
    const searchBox = ref(null);
    const confirm = ref(null);
    const searchScroll = ref(null);
    const sugScroll = ref(null);
    const shortcutWrapper = ref(null);
    const searchResWrapper = ref(null);
    const search = reactive({
      hotkey: [],
      query: "",
    });
    const searchHistory = computed(() => store.getters.searchHistory);
    const shortcut = computed(() => [...search.hotkey, ...searchHistory.value]);
    function addQuery(key) {
      searchBox.value.setQuery(key);
    }
    function onQueryChange(query) {
      search.query = query;
    }
    function saveSearch() {
      store.dispatch("saveSearchHistory", search.query);
    }
    function deleteQuery(item) {
      store.dispatch("deleteSearchHistory", item);
    }
    function clearHistory() {
      store.dispatch("clearSearchHistory");
    }
    function showConfirm() {
      confirm.value.onShow();
    }
    onMounted(() => {
      getHotkey().then((res) => {
        search.hotkey = res.slice(0, 12);
      });
    });
    watch(
      () => search.query,
      (newQ) => {
        if (!newQ) {
          root.$nextTick(() => searchScroll.value.refresh());
        }
      }
    );
    const playList = computed(() => store.getters.playList);
    onMounted(() => {
      _handlePlayList(playList.value);
    });
    onActivated(() => {
      _handlePlayList(playList.value);
    });
    function _handlePlayList(list) {
      const bottom = list.length > 0 ? "60px" : "";
      searchResWrapper.value.style.bottom = bottom;
      sugScroll.value.refresh();
      shortcutWrapper.value.style.bottom = bottom;
      searchScroll.value.refresh();
    }
    watch(
      () => playList.value,
      (newV) => {
        _handlePlayList(newV);
      },
      { lazy: true }
    );
    return {
      ...toRefs(search),
      addQuery,
      searchBox,
      onQueryChange,
      saveSearch,
      searchHistory,
      deleteQuery,
      clearHistory,
      confirm,
      showConfirm,
      shortcut,
      searchScroll,
      searchResWrapper,
      shortcutWrapper,
      sugScroll,
    };
  },
};
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/variable.styl";

.search
  .search-box-wrapper
    margin: 20px
  .shortcut-wrapper
    position: fixed
    top: 178px
    bottom: 0
    width: 100%
    .shortcut
      height: 100%
      overflow: hidden
      .hot-key
        margin: 0 20px 20px 20px
        .title
          margin-bottom: 20px
          font-size: $font-size-medium
          color: $color-text-l
        .item
          display: inline-block
          padding: 5px 10px
          margin: 0 20px 10px 0
          border-radius: 6px
          background: $color-highlight-background
          font-size: $font-size-medium
          color: $color-text-d
      .search-history
        position: relative
        margin: 0 20px
        .title
          display: flex
          align-items: center
          height: 40px
          font-size: $font-size-medium
          color: $color-text-l
          .text
            flex: 1
          .clear
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
  .search-result
    position: fixed
    width: 100%
    top: 178px
    bottom: 0
</style>
