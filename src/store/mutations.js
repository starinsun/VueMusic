import {
  SET_SINGER,
  SET_SINGER_SONGS,
  SET_PLAYING_STATE,
  SET_FULL_SCREEN,
  SET_PLAYLIST,
  SET_SEQUENCE_LIST,
  SET_MODE,
  SET_CURRENT_IDX,
  SET_DISC,
  SET_RANK,
  SET_SEARCH_HISTORY,
} from "./constant";

const mutations = {
  [SET_SINGER](state, singer) {
    state.singer = singer;
  },
  [SET_SINGER_SONGS](state, songs) {
    state.songs = songs;
  },
  [SET_PLAYING_STATE](state, flag) {
    state.playing = flag;
  },
  [SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag;
  },
  [SET_PLAYLIST](state, list) {
    state.playList = list;
  },
  [SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list;
  },
  [SET_MODE](state, mode) {
    state.mode = mode;
  },
  [SET_CURRENT_IDX](state, idx) {
    state.currentIdx = idx;
  },
  [SET_DISC](state, disc) {
    state.disc = disc;
  },
  [SET_RANK](state, rank) {
    state.rank = rank;
  },
  [SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history;
  },
};

export default mutations;
