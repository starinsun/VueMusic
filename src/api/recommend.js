import { baseUrl, nomarlise } from "./index";
export async function getRecommendBanner() {
  let res = await fetch(`${baseUrl}getDigitalAlbumLists`).then((v) => v.json());
  return res?.response?.data?.banner;
}

export async function getSongList() {
  let res = await fetch(`${baseUrl}getSongLists`).then((v) => v.json());
  return res?.response?.data?.list;
}

export async function getDiscList(id) {
  let res = await fetch(`${baseUrl}getSongListDetail?disstid=${id}`).then((v) =>
    v.json()
  );
  let list = res.response.cdlist[0].songlist;
  let nomalData = await nomarlise(list);
  return nomalData;
}
