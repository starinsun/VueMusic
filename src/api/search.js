import { baseUrl, nomarlise } from ".";

export async function getHotkey() {
  let res = await fetch(`${baseUrl}getHotkey`).then((v) => v.json());
  return res.response.data.hotkey;
}

export async function getSearchRes(key, page = 1, limit = 15) {
  let res = await fetch(
    `${baseUrl}getSearchByKey?key=${key}&page=${page}&limit=${limit}`
  ).then((v) => v.json());
  let normalData = await nomarlise(res.response.data.song.list);
  normalData.data = res.response.data.song;
  return normalData;
}
