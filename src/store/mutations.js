import { SET_SINGER, SET_SINGER_SONGS } from "./constant";

const mutations = {
  [SET_SINGER](state, singer) {
    state.singer = singer;
  },
  [SET_SINGER_SONGS](state, songs) {
    state.songs = songs;
  }
};

export default mutations;
