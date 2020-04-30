import { nomarlise, baseUrl } from ".";

export async function getRankList() {
  let res = await fetch(`${baseUrl}getTopLists`).then((v) => v.json());
  return res?.response?.data?.topList;
}

export async function getRankDetail(id) {
  let res = await fetch(`${baseUrl}getRanks?topId=${id}`).then((v) => v.json());
  let list = res.response.detail.data.songInfoList;
  const normalData = await nomarlise(list);
  return normalData;
}
