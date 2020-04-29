<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li
        @click="selectItem(item)"
        :key="item"
        class="search-item"
        v-for="item in searches"
      >
        <span class="text">{{ item }}</span>
        <span class="icon" @click.stop="deleteItem(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default: () => [],
    },
  },
  setup(_, { emit }) {
    function selectItem(item) {
      emit("select", item);
    }
    function deleteItem(item) {
      emit("delete", item);
    }
    return {
      selectItem,
      deleteItem,
    };
  },
};
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/variable";

  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
