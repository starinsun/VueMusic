import { getSingerDetail } from "../api/singer";
import {
  SET_SINGER_SONGS,
  SET_SEQUENCE_LIST,
  SET_PLAYLIST,
  SET_CURRENT_IDX,
  SET_FULL_SCREEN,
  SET_PLAYING_STATE,
  SET_MODE,
} from "./constant";

export default {
  async [SET_SINGER_SONGS]({ commit }, id) {
    let res = await getSingerDetail(id);
    commit(SET_SINGER_SONGS, res);
  },

  selectPlay({ commit, state }, { list, idx }) {
    commit(SET_SEQUENCE_LIST, list);
    if (state.mode === 2) {
      let randomList = list.slice().sort(() => 0.5 - Math.random());
      commit(SET_PLAYLIST, randomList);
      idx = randomList.findIndex((item) => item.mid === list[idx].mid);
    } else {
      commit(SET_PLAYLIST, list);
    }
    commit(SET_CURRENT_IDX, idx);
    commit(SET_FULL_SCREEN, true);
    commit(SET_PLAYING_STATE, true);
  },

  randomPlay({ commit }, { list }) {
    commit(SET_MODE, 2);
    commit(SET_SEQUENCE_LIST, list);
    let randomList = list.slice().sort(() => 0.5 - Math.random());
    commit(SET_PLAYLIST, randomList);
    commit(SET_CURRENT_IDX, 0);
    commit(SET_FULL_SCREEN, true);
    commit(SET_PLAYING_STATE, true);
  },
};
