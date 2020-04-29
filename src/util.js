import storage from "good-storage";

export const getCount = (count) => {
  if (count < 0) return;
  if (count < 10000) {
    return count;
  } else if (Math.floor(count / 10000) < 10000) {
    return Math.floor(count / 1000) / 10 + "万";
  } else {
    return Math.floor(count / 10000000) / 10 + "亿";
  }
};

const SEARCH_KEY = "__search__";
const SEARCH_MAX_LEN = 15;

function insertArray(arr, val, compare, maxLen) {
  const idx = arr.findIndex(compare);
  if (idx === 0) {
    return;
  }
  if (idx > 0) {
    arr.splice(idx, 1);
  }
  arr.unshift(val);
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}
function deleteFromArray(arr, compare) {
  const idx = arr.findIndex(compare);
  if (idx > -1) {
    arr.splice(idx, 1);
  }
}

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, []);
  insertArray(searches, query, (item) => item === query, SEARCH_MAX_LEN);
  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function localSearch() {
  return storage.get(SEARCH_KEY);
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, []);
  deleteFromArray(searches, (item) => item === query);
  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function clearList() {
  storage.remove(SEARCH_KEY);
  return [];
}
