var util = require("../../utils/util.js");
Page({
  data: {
    chessboardDatas: [[2, 0, 2, 0], [0, 2, 0, 0], [2, 4, 2, 0], [0, 0, 2, 4]],
    current_score: 0,
    best_score: 0,
    toast2Hidden: true
  },
  getCurrentBestScore: function() {
    let best_score = this.data.best_score;
    const current_score = this.data.current_score;

    best_score = current_score > best_score ? current_score : best_score;
    return best_score;
  },
  judgeSuccess: function() {
    const { chessboardDatas } = this.data;

    for (let i = 0; i < chessboardDatas.length; i++) {
      for (let j = 0; j < chessboardDatas[i].length; j++) {
        if (chessboardDatas[i][j] >= 2048) {
          this.recordState();
          this.setData({
            toast2Hidden: false
          });
          break;
        }
      }
    }
  },
  recordState: function() {
    const best_score = this.getCurrentBestScore();
    this.setData({
      best_score: best_score
    });
    wx.setStorageSync("uncompleteState", this.data);
  },
  reset: function() {
    const chessDefaultDatas = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    let maxInitNum = util.getRandomNum(1, 8);
    while (maxInitNum > 0) {
      const num = util.getRandomNum(0, 15);
      this.setChessboardCellNum(chessDefaultDatas, num, 2);
      maxInitNum--;
    }

    this.setData({
      chessboardDatas: chessDefaultDatas,
      current_score: 0,
      toast2Hidden: true
    });
  },
  getChessboardCellNum: function(array, index) {
    let loopCount = 0;
    let cell;
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        if (index === loopCount++) {
          cell = array[i][j];
        }
      }
    }
    return cell;
  },
  setChessboardCellNum: function(array, index, num) {
    let loopCount = 0;
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        if (index === loopCount++) {
          array[i][j] = num;
        }
      }
    }
  },
  generateNewCellNum: function(chessboardDatas) {
    // 1.求出所有剩余空元素
    let remainNullCellNum = 0;
    for (let i = 0; i < chessboardDatas.length; i++) {
      for (let j = 0; j < chessboardDatas[i].length; j++) {
        if (chessboardDatas[i][j] === 0) {
          remainNullCellNum++;
        }
      }
    }
    // 2.随机位置产生一个数
    let newCellNumIndex = util.getRandomNum(0, remainNullCellNum);
    let count = 0;
    for (let i = chessboardDatas.length - 1; i >= 0; i--) {
      for (let j = chessboardDatas[i].length - 1; j >= 0; j--) {
        if (chessboardDatas[i][j] !== 0) {
          continue;
        }
        if (newCellNumIndex === count) {
          chessboardDatas[i][j] = 2;
        }
        count++;
      }
    }
  },
  onLoad: function(options) {
    let data = wx.getStorageSync("uncompleteState");
    if (!!data) {
      this.setData(data);
    }
  },
  onUnload: function() {
    this.recordState();
  },
  onHide: function() {
    this.recordState();
  },
  turnEnd: function(chessboardDatas, addScore) {
    this.generateNewCellNum(chessboardDatas);

    let best_score = this.getCurrentBestScore();
    this.setData({
      chessboardDatas: chessboardDatas,
      current_score: this.data.current_score + addScore,
      best_score: best_score
    });

    this.judgeSuccess();

    util.scanArray(this.data.chessboardDatas);
  },
  turnUp: function() {
    let chessboardDatas = this.data.chessboardDatas;
    let addScore = 0;
    this.reorder_up(chessboardDatas);
    for (let i = 0; i < chessboardDatas.length - 1; i++) {
      for (let j = 0; j < chessboardDatas[i].length; j++) {
        if (chessboardDatas[i][j] === chessboardDatas[i + 1][j]) {
          addScore += chessboardDatas[i][j];
          chessboardDatas[i][j] =
            chessboardDatas[i][j] + chessboardDatas[i + 1][j];
          chessboardDatas[i + 1][j] = 0;
        }
      }
    }
    this.reorder_up(chessboardDatas);
    this.turnEnd(chessboardDatas, addScore);
  },
  turnDown: function() {
    let chessboardDatas = this.data.chessboardDatas;
    let addScore = 0;
    this.reorder_down(chessboardDatas);
    for (let i = chessboardDatas.length - 1; i >= 1; i--) {
      for (let j = chessboardDatas[i].length - 1; j >= 0; j--) {
        if (chessboardDatas[i][j] === chessboardDatas[i - 1][j]) {
          addScore += chessboardDatas[i][j];
          chessboardDatas[i][j] =
            chessboardDatas[i][j] + chessboardDatas[i - 1][j];
          chessboardDatas[i - 1][j] = 0;
        }
      }
    }
    this.reorder_down(chessboardDatas);
    this.turnEnd(chessboardDatas, addScore);
  },
  turnLeft: function() {
    let chessboardDatas = this.data.chessboardDatas;
    let addScore = 0;
    this.reorder_left(chessboardDatas);
    for (let j = 0; j < chessboardDatas.length - 1; j++) {
      for (let i = 0; i < chessboardDatas.length; i++) {
        if (chessboardDatas[i][j] === chessboardDatas[i][j + 1]) {
          addScore += chessboardDatas[i][j];
          chessboardDatas[i][j] =
            chessboardDatas[i][j] + chessboardDatas[i][j + 1];
          chessboardDatas[i][j + 1] = 0;
        }
      }
    }
    this.reorder_left(chessboardDatas);
    this.turnEnd(chessboardDatas, addScore);
  },
  turnRight: function() {
    let addScore = 0;
    let chessboardDatas = this.data.chessboardDatas;
    this.reorder_right(chessboardDatas);
    for (let j = chessboardDatas.length - 1; j >= 0; j--) {
      for (let i = chessboardDatas.length - 1; i >= 1; i--) {
        if (chessboardDatas[i][j] === chessboardDatas[i][j - 1]) {
          addScore += chessboardDatas[i][j];
          chessboardDatas[i][j] =
            chessboardDatas[i][j] + chessboardDatas[i][j - 1];
          chessboardDatas[i][j - 1] = 0;
        }
      }
    }
    this.reorder_right(chessboardDatas);
    this.turnEnd(chessboardDatas, addScore);
  },
  reorder_up: function(chessboardDatas) {
    for (let i = 0; i < chessboardDatas.length; i++) {
      for (let j = 0; j < chessboardDatas[i].length; j++) {
        let rowIndex = i;
        while (rowIndex - 1 >= 0 && chessboardDatas[rowIndex - 1][j] === 0) {
          chessboardDatas[rowIndex - 1][j] = chessboardDatas[rowIndex][j];
          chessboardDatas[rowIndex][j] = 0;
          rowIndex--;
        }
      }
    }
  },
  reorder_down: function(chessboardDatas) {
    for (let i = chessboardDatas.length - 2; i >= 0; i--) {
      for (let j = chessboardDatas[i].length - 1; j >= 0; j--) {
        let rowIndex = i;
        while (
          rowIndex + 1 <= chessboardDatas.length - 1 &&
          chessboardDatas[rowIndex + 1][j] === 0
        ) {
          chessboardDatas[rowIndex + 1][j] = chessboardDatas[rowIndex][j];
          chessboardDatas[rowIndex][j] = 0;
          rowIndex++;
        }
      }
    }
  },
  reorder_left: function(chessboardDatas) {
    for (let j = 0; j < chessboardDatas.length; j++) {
      for (let i = 0; i < chessboardDatas[j].length; i++) {
        let rowIndex = j;
        while (rowIndex - 1 >= 0 && chessboardDatas[i][rowIndex - 1] === 0) {
          chessboardDatas[i][rowIndex - 1] = chessboardDatas[i][rowIndex];
          chessboardDatas[i][rowIndex] = 0;
          rowIndex--;
        }
      }
    }
  },
  reorder_right: function(chessboardDatas) {
    for (let j = chessboardDatas.length - 2; j >= 0; j--) {
      for (let i = chessboardDatas.length - 1; i >= 0; i--) {
        let rowIndex = j;
        while (
          rowIndex + 1 <= chessboardDatas.length - 1 &&
          chessboardDatas[i][rowIndex + 1] === 0
        ) {
          chessboardDatas[i][rowIndex + 1] = chessboardDatas[i][rowIndex];
          chessboardDatas[i][rowIndex] = 0;
          rowIndex++;
        }
      }
    }
  }
});
