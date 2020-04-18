const baseUrl = "http://106.15.37.245:3200/";

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
  let list = res.response.cdlist[0].songlist,
    arr = [],
    arr1 = [];
  for (let i = 0; i < list.length; i++) {
    arr.push(`http://106.15.37.245:3200/getMusicVKey?songmid=${list[i].mid}`);
    arr1.push(`http://106.15.37.245:3200/getLyric?songmid=${list[i].mid}`);
  }
  let promises = await Promise.all(
    arr.map((item) =>
      fetch(item)
        .then((v) => v.json())
        .then((v) => v?.response?.playLists)
    )
  );
  let promises1 = await Promise.all(
    arr1.map((item) =>
      fetch(item)
        .then((v) => v.json())
        .then((v) => v?.response.lyric)
    )
  );
  let newList = list.map((v, i) => {
    let final = {};
    final["singer"] = v.singer;
    final["album"] = v.album;
    final["interval"] = v.interval;
    final["mid"] = v.mid;
    final["mv"] = v.mv;
    final["name"] = v.name;
    final["audio"] = promises[i].length ? promises[i][0] : "";
    final[
      "img"
    ] = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${v.album.mid}.jpg`;
    final["lyric"] = promises1[i] ? promises1[i] : "";
    return final;
  });
  return newList;
}
