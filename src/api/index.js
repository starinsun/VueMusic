export const baseUrl = "http://106.15.37.245:3200/";

export const nomarlise = async (list) => {
  const arr = [],
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
};
