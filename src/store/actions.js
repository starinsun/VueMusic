import { getSingerDetail } from "../api/singer";
import { SET_SINGER_SONGS } from "./constant";

export default {
  async [SET_SINGER_SONGS]({ commit }, id) {
    let res = await getSingerDetail(id);
    commit(SET_SINGER_SONGS, res);
  }
};
