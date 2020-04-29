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

  insertSong({ commit, state }, song) {
    let playList = state.playList.slice();
    let sequenceList = state.sequenceList.slice();
    let currentIdx = state.currentIdx;
    let curSong = playList[currentIdx];
    let fdIdx = playList.findIndex((item) => item.mid === song.mid);
    currentIdx++;
    playList.splice(currentIdx, 0, song);
    if (fdIdx > -1) {
      if (currentIdx > fdIdx) {
        playList.splice(fdIdx, 1);
        currentIdx--;
      } else {
        playList.splice(fdIdx + 1, 1);
      }
    }
    let curSeqIdx =
      sequenceList.findIndex((item) => item.mid === curSong.mid) + 1;
    let fsIdx = sequenceList.findIndex((item) => item.mid === song.mid);
    sequenceList.splice(curSeqIdx, 0, song);
    if (fsIdx > -1) {
      if (curSeqIdx > fsIdx) {
        sequenceList.splice(fsIdx, 1);
      } else {
        sequenceList.splice(fsIdx + 1, 1);
      }
    }
    commit(SET_PLAYLIST, playList);
    commit(SET_SEQUENCE_LIST, sequenceList);
    commit(SET_CURRENT_IDX, currentIdx);
    commit(SET_FULL_SCREEN, true);
    commit(SET_PLAYING_STATE, true);
  },
};
