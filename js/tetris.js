var game = {
  OFFSET: 15, // 保存游戏主界面的内边距
  CSIZE: 26, // 保存格子大小(图片的宽高)
  shape: null, // 保存主角图形
  pg: null, // 保存游戏容器
  interval: 500, // 下落时间间隔
  timer: null, // 定时器序号
  CN: 10,
  RN: 20, // 保存最大列数和行数
  wall: null, // 保存方块墙
  nextShape: null, // 保存备胎
  score: 0,
  lines: 0, // 保存分数和行数
  SCORES: [0, 10, 30, 60, 100], // 删除对应行所得分数
  state: 0, // 保存游戏状态
  GAMEOVER: 0, // 游戏结束
  RUNNING: 1, // 运行中
  PAUSE: 2, // 暂停
  start() { // 启动游戏
    // 将状态重置为巡行中
    this.state = this.RUNNING;
    // 将分数和行数清0
    this.score = this.lines = 0;
    // 创建空数组, 保存再wall中
    this.wall = [];
    // 创建一个CN*RN的二维数组
    for (var r = 0; r < this.RN; r++) {
      this.wall[r] = new Array(this.CN);
    }
    // 查找class为playground的div保存在pg属性中
    this.pg = document.getElementsByClassName("playground")[0];
    // 新建一个图形, 保存在shape属性中
    this.nextShape = this.randomShape();
    this.shape = this.randomShape();
    this.paint(); // 重绘一切
    // 启动周期性定时器, 每隔interval, 调用一次moveDown
    this.timer = setInterval(
      this.moveDown.bind(this),
      this.interval
    );
    document.onkeydown = function (e) {
      switch (e.keyCode) {
        case 37: // 左移
          this.state == this.RUNNING && this.moveLeft();
          break;
        case 39: // 右移
          this.state == this.RUNNING && this.moveRight();
          break;
        case 40: // 下移
          this.state == this.RUNNING && this.moveDown();
          break;
        case 38: // 旋转：顺时针
          this.state == this.RUNNING && this.rotateR();
          break;
        case 90: // 旋转：逆时针 
          this.state == this.RUNNING && this.rotateL();
          break;
        case 80: // p 暂停
          this.state == this.RUNNING && this.pause();
          break;
        case 67: // 继续游戏(C)
          this.myContinue();
          break;
        case 81: // 退出游戏(Q)
          this.quit();
          break;
        case 83: // 重新开始游戏(S)
          this.start();
          break;
        case 32: // 一落到底
          this.hardDrop();
          break;
      }
    }.bind(this);
  },
  randomShape() { // 随机创建图形
    var shapes = ["T", "S", "Z", "O", "L", "J", "I"];
    // 0~6之间生成随机整数
    switch (Math.floor(Math.random() * 7)) {
      case 0:
        return new O();
        break;
      case 1:
        return new I();
        break;
      case 2:
        return new S();
        break;
      case 3:
        return new Z();
        break;
      case 4:
        return new L();
        break;
      case 5:
        return new J();
        break;
      case 6:
        return new T();
        break;
    }
  },
  rotateR() { // 顺时针旋转
    this.shape.rotateR();
    // 如果不能旋转
    if (!this.canRotate())
      this.shape.rotateL();
  },
  rotateL() { // 逆时针旋转
    this.shape.rotateL();
    // 如果不能旋转
    if (!this.canRotate())
      this.shape.rotateR();
  },
  canRotate() { // 旋转后判断是否越界或撞墙
    // 遍历shape的cells中每个cell
    for (var i = 0; i < this.shape.cells.length; i++) {
      // 将当前cell保存在cell中
      var cell = this.shape.cells[i];
      // 如果:1. cell.r<0或cell.r>=RN; 2. cell.c<0或cell.c>=CN; 3. 在wall中相同位置有格(不为undefined);
      if (cell.r < 0 || cell.r >= this.RN ||
        cell.c < 0 || cell.c >= this.CN ||
        this.wall[cell.r][cell.c] !== undefined)
        return false; // 返回false
    } // (遍历结束)
    return true; // 返回true
  },
  hardDrop() {
    //反复: 只有可以下落
    while (this.canDown()) {
      // 就调用游戏的moveDown
      this.shape.moveDown();
    }
  },
  canLeft() { // 判断能否左移
    // 2个条件: 每个格子左边是否有格子; 每个格子左边的r是否为0(到边)
    // 遍历shape的cells中每个cell
    for (var i = 0; i < this.shape.cells.length; i++) {
      // 将当前cell另存为cell
      var cell = this.shape.cells[i];
      // 如果cell的c等于0或者wall中cell的左侧不是undefined
      if (cell.c == 0 || this.wall[cell.r][cell.c - 1] !== undefined)
        return false;
      // 返回false
    } // (遍历结束)
    return true; // 返回true
  },
  moveLeft() { // 左移图形
    // 如果可以左移
    if (this.canLeft()) {
      // 调用shape的moveLeft方法
      this.shape.moveLeft();
      // 重绘一切
      this.paint();
    }
  },
  canRight() { // 判断能否右移
    // 2个条件: 每个格子右边是否有格子; 每个格子右边的r是否为CN-1(到边)
    // 遍历shape的cells中每个cell
    for (var i = 0; i < this.shape.cells.length; i++) {
      // 将当前cell另存为cell
      var cell = this.shape.cells[i];
      // 如果cell的c等于CN-1或者wall中cell的右侧位置不是undefined
      if (cell.c == this.CN - 1 || this.wall[cell.r][cell.c + 1] != undefined)
        return false; // 返回false
    } // (遍历结束)
    return true; // 返回true
  },
  moveRight() { // 右移图形
    // 如果可以右移
    if (this.canRight()) {
      // 调用shape的moveRight方法
      this.shape.moveRight();
      // 重绘一切
      this.paint();
    }
  },
  canDown() { // 判断能否下落
    // 遍历shape的cells中每个cell
    for (var i = 0; i < this.shape.cells.length; i++) {
      // 如果cell的r等于RN-1, 就返回false, 或者如果wall中cell的下方位置不为undefined,就返回false
      var cell = this.shape.cells[i];
      if (cell.r == this.RN - 1 || this.wall[cell.r + 1][cell.c] !== undefined) return false;
    } // (遍历结束)
    return true; // 就返回true
  },
  moveDown() { // 让图形下落一步
    // 如果可以下落
    if (this.canDown())
      this.shape.moveDown(); // 只改内存, 不改页面
    else { // 否则 停止下落
      // 将旧的图形落入墙里
      this.landIntoWall();
      // 删除满格的行, 并获得删除的行数ln
      var ln = this.deleteRows();
      // 将ln累加到总行数中
      this.lines += ln;
      // 所删除的行数对应分数下标
      this.score += this.SCORES[ln];
      // 如果游戏没有结束
      if (!this.isGameOver()) {
        // // 新建一个T图形, 保存到shape属性中
        // this.shape = this.randomShape();
        // 将备胎转正, 再生成一个新的备胎
        this.shape = this.nextShape;
        this.nextShape = this.randomShape();
      } else { // 否则, 退出游戏
        this.quit();
      }
    }
    this.paint(); // 重绘一切
  },
  deleteRows() { // 删除所有满格的行
    var ln = 0; // 记录删除的行数, 一次性最多删除4行(图形I)
    // 自底向上遍历wall中每一行
    for (var r = this.RN - 1; r >= 0 && ln < 4; r--) {
      // 如果当前行是空行, 退出循环
      if (this.wall[r].join("") == "") break;
      // 如果当前行是满格
      if (this.isFullRow(r)) {
        // 就删除当前行
        this.deleteRow(r);
        // r留在原地, 继续判断新行是否满格
        r++;
        ln++;
      }
    }
    return ln;
  },
  deleteRow(r) { // 删除第r行
    // 从r行开始, 反向遍历wall中每一行
    for (; r >= 0; r--) {
      // 将wall中r-1行赋值给r行
      this.wall[r] = this.wall[r - 1];
      // 将wall中r-1行赋值为CN个空元素的数组
      this.wall[r - 1] = new Array(this.CN);
      // 遍历wall中r行每个格
      for (var c = 0; c < this.wall[r].length; c++) {
        // 如果当前格不是undefined
        if (this.wall[r][c] !== undefined)
          // 就将当前格的r+1
          this.wall[r][c].r += 1;
      } // (遍历结束)
      // 如果wall中r-2行是空行, 就退出循环
      if (this.wall[r - 2].join("") == "") break;
    }
  },
  isFullRow(r) { // 判断第r行是否满格
    // 如果在当前行的字符串中没有找到开头的逗号或者结尾的逗号或者连续两个的逗号, 说明是满格
    return String(this.wall[r]).search(/^,|,,|,$/) == -1;
  },
  landIntoWall() { // 主角图形落入墙中
    // 遍历shape的cells中每个cell
    for (var i = 0; i < this.shape.cells.length; i++) {
      // 将当前cell另存再变量cell中
      var cell = this.shape.cells[i];
      // 将cell保存到wall中相同r行c列的位置
      this.wall[cell.r][cell.c] = cell;
    }
  },
  paint() { // 重绘一切
    // 先清除所有的img => 将pg下的所有元素替换为""
    var reg = /<img [^>]+>/g;
    this.pg.innerHTML = this.pg.innerHTML.replace(reg, "");
    this.paintShape(); // 再重绘
    this.paintWall(); // 绘制墙
    this.paintNext(); // 绘制备胎
    this.paintScore(); // 绘制分数和行数
    this.paintState(); // 重绘状态
  },
  paintState() { // 根据游戏状态绘制图片
    if (this.state != this.RUNNING) {
      var img = new Image();
      img.src = this.state == this.GAMEOVER ?
        "img/game-over.png" :
        "img/pause.png";
      img.style.width = "100%";
      this.pg.appendChild(img);
    }
  },
  paintScore() { // 绘制分数和行数
    // 找到id为score的span,设置其内容为score属性
    document.getElementById("score").innerHTML = this.score;
    // 找到id为lines的span,设置其内容为lines属性
    document.getElementById("lines").innerHTML = this.lines;
  },
  paintNext() { // 重绘备胎图形
    // 创建文档片段frag
    var frag = document.createDocumentFragment();
    // 遍历shape中 cells 数组中每个cell
    for (var i = 0, len = this.nextShape.cells.length; i < len; i++) {
      // 将当前cell保存在变量cell中
      var cell = this.nextShape.cells[i];
      var img = this.paintCell(cell, frag); // 绘制格
      // 设置img的left为当前left+10*CSIZE
      img.style.left = parseFloat(img.style.left) + 10 * this.CSIZE + "px";
      // 设置img的top为当前top+*CSIZE
      img.style.top = parseFloat(img.style.top) + this.CSIZE + "px";
    } // (遍历结束)
    // 将frag追加到pg属性中
    this.pg.appendChild(frag);
  },
  paintCell(cell, frag) { // 绘制格子
    // 新建一个img
    var img = new Image();
    // 设置img的宽为 CSIZE
    img.style.width = this.CSIZE + "px";
    // 设置img的top为 OFFSET + CSIZE * cell的r
    img.style.top = (this.OFFSET + this.CSIZE * cell.r) + "px";
    // 设置img的left为 OFFSET + CSIZE * cell的c
    img.style.left = (this.OFFSET + this.CSIZE * cell.c) + "px";
    // 设置img的src为cell中的src
    img.src = cell.src;
    // 将img追加到frag中
    frag.appendChild(img);

    // 返回创建的img
    return img;
  },
  paintShape() { // 绘制主角图形
    // 创建文档片段frag
    var frag = document.createDocumentFragment();
    // 遍历shape中 cells 数组中每个cell
    for (var i = 0, len = this.shape.cells.length; i < len; i++) {
      // 将当前cell保存在变量cell中
      var cell = this.shape.cells[i];
      this.paintCell(cell, frag); // 绘制格
    } // (遍历结束)
    // 将frag追加到pg属性中
    this.pg.appendChild(frag);
  },
  paintWall() { // 绘制墙
    // 创建frag
    var frag = document.createDocumentFragment();
    // 自底向上遍历每一行
    for (var r = this.RN - 1; r >= 0; r--) {
      // 如果当前行是空行, 就退出循环
      if (this.wall[r].join("") == "") break;
      else { // 否则
        // 遍历当前行中每一列(格)
        for (var c = 0; c < this.CN; c++) {
          // 如果wall中当前格不是undefined
          if (this.wall[r][c] != undefined) {
            this.paintCell(this.wall[r][c], frag); // 绘制格
          }
        }
      }
    } // (遍历结束)
    // 将frag追加到pg中
    this.pg.appendChild(frag);
  },
  pause() { // 暂停游戏
    clearInterval(this.timer);
    this.timer = null;
    this.state = this.PAUSE;
    this.paint();
  },
  myContinue() { // 继续游戏
    this.state = this.RUNNING;
    this.timer = setInterval(
      this.moveDown.bind(this),
      this.interval,
    );
  },
  quit() { // 退出游戏
    this.state = this.GAMEOVER;
    clearInterval(this.timer);
    this.timer = null;
    this.paint();
  },
  isGameOver() { // 判断游戏是否结束
    // 遍历备胎图形cells的每个格子
    for(var i = 0; i < this.nextShape.cells.length;i++){
      // 另存cell
      var cell = this.nextShape.cells[i];
      if(this.wall[cell.r][cell.c] !== undefined)// 如果在wall中cell相同位置有格
        return true;// 返回true
    }
    return false;
  }
}
game.start();