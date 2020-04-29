import { baseUrl, nomarlise } from "./index";
export const singerTag = [
  ["热门", -100, -100, -100],
  ["内地男", 200, 1, 0],
  ["内地女", 200, 1, 1],
  ["港台男", 2, 1, 0],
  ["港台女", 2, 1, 1],
  ["组合", -100, -100, 2],
  ["民谣", -100, 3, -100],
  ["摇滚", -100, 2, -100],
  ["R&B", -100, 8, -100],
  ["欧美", 5, -100, -100],
  ["日本", 4, -100, -100],
  ["韩国", 3, -100, -100],
  ["嘻哈", -100, 6, -100],
  ["轻音乐", -100, 9, -100],
  ["其他", 6, -100, -100],
];

export function getSingerList() {
  let res = Promise.all(
    singerTag.map((arr) =>
      fetch(
        `${baseUrl}getSingerList?area=${arr[1]}&genre=${arr[2]}&sex=${arr[3]}`
      )
        .then((v) => v.json())
        .then((v) => v?.response?.singerList?.data?.singerlist.slice(0, 30))
    )
  );
  return res;
}

export async function getSingerDetail(id) {
  let res = await fetch(
    `${baseUrl}getSingerAlbum?singermid=${id}&limit=23`
  ).then((v) => v.json());
  let list = res?.response?.singer?.data?.songlist;
  let normalData = await nomarlise(list);
  return normalData;
}
