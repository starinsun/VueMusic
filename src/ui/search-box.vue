<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" :placeholder="placeHolder" v-model="query" />
    <i class="icon-dismiss" v-show="query" @click="clearSearch"></i>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "@vue/composition-api";
export default {
  props: {
    placeHolder: {
      type: String,
      default: "搜索歌曲，歌手",
    },
  },
  setup(_, { root, emit }) {
    const search = reactive({
      query: "",
    });
    function clearSearch() {
      search.query = "";
    }
    function setQuery(item) {
      search.query = item;
    }
    // FIXME:为什么这里要用root.$watch而不直接用watch呢？
    onMounted(() => {
      root.$watch(
        () => search.query,
        (newQ) => {
          emit("query", newQ);
        }
      );
    });
    return {
      ...toRefs(search),
      clearSearch,
      setQuery,
    };
  },
};
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/variable";

.search-box
  display: flex
  align-items: center
  box-sizing: border-box
  width: 100%
  padding: 0 6px
  height: 40px
  background: $color-highlight-background
  border-radius: 6px
  .icon-search
    font-size: 28px
    color: $color-background
  .box
    flex: 1
    margin: 0 5px
    line-height: 18px
    background: $color-highlight-background
    color: $color-text
    font-size: $font-size-medium-x
    outline: 0
    &::placeholder
      color: $color-text-d
  .icon-dismiss
    font-size: 18px
    color: $color-background
</style>
