export default {
  singer: (state) => state.singer,
  songs: (state) => state.songs,
  playing: (state) => state.playing,
  fullScreen: (state) => state.fullScreen,
  playList: (state) => state.playList,
  sequenceList: (state) => state.sequenceList,
  mode: (state) => state.mode,
  currentIdx: (state) => state.currentIdx,
  currentSong: (state) => state.playList[state.currentIdx] || {},
};
