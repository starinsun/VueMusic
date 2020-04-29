<template>
  <div class="search">
    <div class="search-box-wrapper">
      <SearchBox ref="searchBox" @query="onQueryChange"></SearchBox>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
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
      </div>
    </div>
    <div class="search-result" v-show="query">
      <Suggest :query="query"></Suggest>
    </div>
  </div>
</template>

<script>
import SearchBox from "../ui/search-box";
import Suggest from "../components/Suggest";
import { onMounted, reactive, toRefs, ref } from "@vue/composition-api";
import { getHotkey } from "../api/search";

export default {
  components: {
    SearchBox,
    Suggest,
  },
  setup() {
    const searchBox = ref(null);
    const search = reactive({
      hotkey: [],
      query: "",
    });
    function addQuery(key) {
      searchBox.value.setQuery(key);
    }
    function onQueryChange(query) {
      search.query = query;
    }
    onMounted(() => {
      getHotkey().then((res) => {
        search.hotkey = res.slice(0, 12);
      });
    });
    return {
      ...toRefs(search),
      addQuery,
      searchBox,
      onQueryChange,
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
