import { localSearch } from "../util";

const state = {
  singer: {},
  songs: [],
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: 0,
  currentIdx: -1,
  disc: {},
  rank: {},
  searchHistory: localSearch(),
};
/**
 * mode:0:sequece, 1: loop, 2:random
 */
export default state;
