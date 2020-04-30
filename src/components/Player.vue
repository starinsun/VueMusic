<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.img" />
        </div>
        <div class="top">
          <div class="back" @click="miniPlay">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="singer"></h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="midTouchStart"
          @touchmove.prevent="midTouchMove"
          @touchend="midTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper">
              <div class="cd">
                <img class="image" :class="cdClass" :src="currentSong.img" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">
                {{ sing.playingLyric }}
              </div>
            </div>
          </div>
          <Scroll
            class="middle-r"
            ref="lyricList"
            :data="sing.lyric && sing.lyric.lines"
          >
            <div class="lyric-wrapper">
              <div v-if="sing.lyric">
                <p
                  ref="lyricLines"
                  class="text"
                  :class="{ current: sing.currentLineNum === idx }"
                  v-for="(line, idx) in sing.lyric.lines"
                  :key="idx"
                >
                  {{ line.txt }}
                </p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span
              class="dot"
              :class="{ active: sing.currentShow === 'cd' }"
            ></span>
            <span
              class="dot"
              :class="{ active: sing.currentShow === 'lyric' }"
            ></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(sing.currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar
                @percentChange="barChange"
                :percent="percent"
              ></ProgressBar>
            </div>
            <span class="time time-r">{{ format(currentSong.interval) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="noClass">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="noClass">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="noClass">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i
                @click="toggleFavor(currentSong)"
                :class="getFavorIcon(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="fullScreenPlay">
        <div class="icon">
          <div class="imgWrapper">
            <img
              width="40"
              height="40"
              :src="currentSong.img"
              :class="cdClass"
            />
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="singer"></p>
        </div>
        <div class="control">
          <ProgressCircle :radius="sing.radius" :percent="percent">
            <i
              class="icon-mini"
              @click.stop="togglePlaying"
              :class="miniIcon"
            ></i>
          </ProgressCircle>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <Playlist ref="playComponent"></Playlist>
    <audio
      :src="currentSong.audio"
      ref="audio"
      @canplay="ready"
      @error="error"
      @timeupdate="timeUpdate"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { computed, ref, watch, reactive } from "@vue/composition-api";
import {
  SET_FULL_SCREEN,
  SET_PLAYING_STATE,
  SET_CURRENT_IDX,
  SET_MODE,
  SET_PLAYLIST,
} from "../store/constant";
import ProgressBar from "../ui/progress-bar";
import ProgressCircle from "../ui/progress-circle";
import Scroll from "../ui/scroll";
import Playlist from "./Playlist";
import Lyric from "lyric-parser";

export default {
  name: "Player",
  components: { ProgressBar, ProgressCircle, Scroll, Playlist },
  setup(_, { root }) {
    const touch = {};
    const store = root.$store;
    const audio = ref(null);
    const lyricList = ref(null);
    const lyricLines = ref(null);
    const middleL = ref(null);
    const playComponent = ref(null);
    const sing = reactive({
      ready: false,
      currentTime: 0,
      radius: 32,
      lyric: null,
      currentLineNum: 0,
      currentShow: "cd",
      playingLyric: "",
    });
    const fullScreen = computed(() => store.getters.fullScreen);
    const playList = computed(() => store.getters.playList);
    const currentSong = computed(() => store.getters.currentSong);
    const playing = computed(() => store.getters.playing);
    const currentIdx = computed(() => store.getters.currentIdx);
    const sequenceList = computed(() => store.getters.sequenceList);
    const mode = computed(() => store.getters.mode);
    const iconMode = computed(() =>
      mode.value === 0
        ? "icon-sequence"
        : mode.value === 1
        ? "icon-loop"
        : "icon-random"
    );
    const singer = computed(() => {
      let strs = currentSong.value.singer
        ? currentSong.value.singer.map((v) => v.name)
        : [];
      return strs.join(" & ");
    });
    const playIcon = computed(() =>
      playing.value ? "icon-pause" : "icon-play"
    );
    const miniIcon = computed(() =>
      playing.value ? "icon-pause-mini" : "icon-play-mini"
    );
    const cdClass = computed(() => (playing.value ? "play" : "play pause"));
    const noClass = computed(() => (sing.ready ? "" : "disable"));
    const percent = computed(
      () => sing.currentTime / currentSong.value.interval
    );
    function miniPlay() {
      store.commit(SET_FULL_SCREEN, false);
    }
    function fullScreenPlay() {
      store.commit(SET_FULL_SCREEN, true);
    }
    function togglePlaying() {
      if (!sing.ready) return;
      store.commit(SET_PLAYING_STATE, !playing.value);
      if (sing.lyric) {
        sing.lyric.togglePlay();
      }
    }
    function next() {
      if (!sing.ready) return;
      if (playList.value.length === 1) {
        _loop();
      } else {
        let idx = currentIdx.value + 1;
        if (idx === playList.value.length) idx = 0;
        store.commit(SET_CURRENT_IDX, idx);
        if (!playing.value) {
          togglePlaying();
        }
      }
      sing.ready = false;
    }
    function prev() {
      if (!sing.ready) return;
      if (playList.value.length === 1) {
        _loop();
      } else {
        let idx = currentIdx.value - 1;
        if (idx === -1) idx = playList.value.length - 1;
        store.commit(SET_CURRENT_IDX, idx);
        if (!playing.value) {
          togglePlaying();
        }
      }
      sing.ready = false;
    }
    function ready() {
      sing.ready = true;
    }
    function error() {
      sing.ready = true;
    }
    function end() {
      if (mode.value === 1) {
        _loop();
      } else {
        next();
      }
    }
    function timeUpdate(e) {
      sing.currentTime = e.target.currentTime;
    }
    function format(interval) {
      interval = interval | 0;
      const min = (interval / 60) | 0;
      const sec = (interval % 60).toString().padStart(2, "0");
      return `${min}:${sec}`;
    }
    function barChange(percent) {
      audio.value.currentTime = currentSong.value.interval * percent;
      if (!playing.value) togglePlaying();
      if (sing.lyric) sing.lyric.seek(audio.value.currentTime * 1000);
    }
    function changeMode() {
      const modetype = (mode.value + 1) % 3;
      store.commit(SET_MODE, modetype);
      let list = sequenceList.value.slice();
      if (mode.value === 2) {
        list.sort(() => 0.5 - Math.random());
      }
      _resetIdx(list);
      store.commit(SET_PLAYLIST, list);
    }
    function midTouchStart(e) {
      touch.init = true;
      const _touch = e.touches[0];
      touch.startX = _touch.pageX;
      touch.startY = _touch.pageY;
    }
    function midTouchMove(e) {
      if (!touch.init) return;
      const _touch = e.touches[0];
      const deltaX = _touch.pageX - touch.startX;
      const deltaY = _touch.pageY - touch.startY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;
      const left = sing.currentShow === "cd" ? 0 : -window.innerWidth;
      const width = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
      touch.percent = Math.abs(width / window.innerWidth);
      lyricList.value.$el.style["transform"] = `translate3d(${width}px,0,0)`;
      lyricList.value.$el.style["transition"] = "0";
      middleL.value.style.opacity = 1 - touch.percent;
    }
    function midTouchEnd() {
      let width, opacity;
      if (sing.currentShow === "cd") {
        if (touch.percent > 0.1) {
          width = -window.innerWidth;
          opacity = 0;
          sing.currentShow = "lyric";
        } else {
          width = 0;
          opacity = 1;
        }
      } else {
        if (touch.percent < 0.9) {
          width = 0;
          opacity = 1;
          sing.currentShow = "cd";
        } else {
          width = -window.innerWidth;
          opacity = 1;
        }
      }
      lyricList.value.$el.style["transform"] = `translate3d(${width}px,0,0)`;
      lyricList.value.$el.style["transition"] = `all 300ms`;
      middleL.value.style.opacity = opacity;
      middleL.value.style["transition"] = `all 300ms`;
    }
    function showPlayList() {
      playComponent.value.onShow();
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
    function _loop() {
      audio.value.currentTime = 0;
      audio.value.play();
      if (sing.lyric) {
        sing.lyric.seek();
      }
    }
    function _resetIdx(list) {
      let idx = list.findIndex((item) => item.mid === currentSong.value.mid);
      store.commit(SET_CURRENT_IDX, idx);
    }
    function _getLyric() {
      sing.lyric = new Lyric(currentSong.value.lyric, _handlerLyric);
      if (playing.value) sing.lyric.play();
    }
    function _handlerLyric({ lineNum, txt }) {
      sing.currentLineNum = lineNum;
      if (lineNum > 7) {
        let lineEl = lyricLines.value[lineNum - 7];
        lyricList.value.scrollToElement(lineEl, 1000);
      } else {
        lyricList.value.scrollTo(0, 0, 1000);
      }
      sing.playingLyric = txt;
    }
    watch(
      () => currentSong.value,
      (newS, oldS) => {
        if (!newS.mid) return;
        if (newS.mid === oldS.mid) return;
        if (sing.lyric) sing.lyric.stop();
        root.$nextTick(() => {
          if (audio.value) audio.value.play();
          _getLyric();
        });
      },
      { lazy: true }
    );
    watch(
      () => playing.value,
      (newP) => {
        root.$nextTick(() => {
          if (audio.value) {
            newP ? audio.value.play() : audio.value.pause();
          }
        });
      },
      { lazy: true }
    );
    return {
      sing,
      fullScreen,
      playList,
      playing,
      mode,
      currentSong,
      miniPlay,
      fullScreenPlay,
      togglePlaying,
      singer,
      audio,
      lyricList,
      playIcon,
      miniIcon,
      cdClass,
      next,
      prev,
      currentIdx,
      lyricLines,
      ready,
      error,
      noClass,
      timeUpdate,
      format,
      computed,
      percent,
      barChange,
      changeMode,
      iconMode,
      sequenceList,
      end,
      midTouchEnd,
      midTouchStart,
      midTouchMove,
      middleL,
      showPlayList,
      playComponent,
      getFavorIcon,
      toggleFavor,
    };
  },
};
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/variable";

.player
  .normal-player
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 150
    background: $color-background
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
    .top
      position: relative
      margin-bottom: 25px
      .back
        position absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 9px
          font-size: $font-size-large-x
          color: $color-theme
          transform: rotate(-90deg)
      .title
        width: 70%
        margin: 0 auto
        line-height: 40px
        text-align: center
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: $font-size-large
        color: $color-text
      .subtitle
        line-height: 20px
        text-align: center
        font-size: $font-size-medium
        color: $color-text
    .middle
      position: fixed
      width: 100%
      top: 80px
      bottom: 170px
      white-space: nowrap
      font-size: 0
      .middle-l
        display: inline-block
        vertical-align: top
        position: relative
        width: 100%
        height: 0
        padding-top: 80%
        .cd-wrapper
          position: absolute
          left: 10%
          top: 0
          width: 80%
          box-sizing: border-box
          height: 100%
          .cd
            width: 100%
            height: 100%
            border-radius: 50%
            .image
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              box-sizing: border-box
              border-radius: 50%
              border: 10px solid rgba(255, 255, 255, 0.1)
            .play
              animation: rotate 20s linear infinite
            .pause
              animation-play-state: paused
        .playing-lyric-wrapper
          width: 80%
          margin: 50px auto 0 auto
          overflow: hidden
          text-align: center
          .playing-lyric
            height: 20px
            line-height: 20px
            font-size: $font-size-medium
            color: $color-text-ll
      .middle-r
        display: inline-block
        vertical-align: top
        width: 100%
        height: 100%
        overflow: hidden
        .lyric-wrapper
          width: 80%
          margin: 0 auto
          overflow: hidden
          text-align: center
          .text
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
            &.current
              color: $color-text
          .pure-music
            padding-top: 50%
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .dot-wrapper
        text-align: center
        font-size: 0
        .dot
          display: inline-block
          vertical-align: middle
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: $color-text-l
          &.active
            width: 20px
            border-radius: 5px
            background: $color-text-ll
      .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0px auto
        padding: 10px 0
        .time
          color: $color-text
          font-size: $font-size-small
          flex: 0 0 30px
          line-height: 30px
          width: 30px
          &.time-l
            text-align: left
          &.time-r
            text-align: right
        .progress-bar-wrapper
          flex: 1
      .operators
        display: flex
        align-items: center
        .icon
          flex: 1
          color: $color-theme
          &.disable
            color: $color-theme-d
          i
            font-size: 30px
        .i-left
          text-align: right
        .i-center
          padding: 0 20px
          text-align: center
          i
            font-size: 40px
        .i-right
          text-align: left
        .icon-favorite
          color: $color-sub-theme
    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s
      .top, .bottom
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .top
        transform: translate3d(0, -100px, 0)
      .bottom
        transform: translate3d(0, 100px, 0)
  .mini-player
    display: flex
    align-items: center
    position: fixed
    left: 0
    bottom: 0
    z-index: 180
    width: 100%
    height: 60px
    background: $color-highlight-background
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .icon
      flex: 0 0 40px
      width: 40px
      height: 40px
      padding: 0 10px 0 20px
      .imgWrapper
        height: 100%
        width: 100%
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
    .text
      display: flex
      flex-direction: column
      justify-content: center
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        margin-bottom: 2px
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: $font-size-medium
        color: $color-text
      .desc
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: $font-size-small
        color: $color-text-d
    .control
      flex: 0 0 30px
      width: 30px
      padding: 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size: 30px
        color: $color-theme-d
      .icon-mini
        font-size: 32px
        position: absolute
        left: 0
        top: 0
@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>
