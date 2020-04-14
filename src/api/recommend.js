const baseUrl = "http://106.15.37.245:3200/";

export async function getRecommendBanner() {
  let res = await fetch(`${baseUrl}getDigitalAlbumLists`).then((v) => v.json());
  return res?.response?.data?.banner;
}

export async function getSongList() {
  let res = await fetch(`${baseUrl}getSongLists`).then((v) => v.json());
  return res?.response?.data?.list;
}
