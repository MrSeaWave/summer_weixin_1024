const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("/") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

const getRandomNum = (Min, Max) => {
  const Range = Max - Min;
  const Rand = Math.random();
  return Min + Math.round(Rand * Range);
};

const swapItems = (arr, index1, index2) => {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
};

const scanArray = arr => {
  let str = "";
  for (let key in arr) {
    if (arr[key] instanceof Array || typeof arr[key] === "object") {
      // 递归调用
      scanArray(arr[key]);
    } else {
      str = str + " " + arr[key];
    }
  }
  console.log(str);
};

module.exports = {
  formatTime: formatTime,
  getRandomNum: getRandomNum,
  swapItems: swapItems,
  scanArray: scanArray
};
