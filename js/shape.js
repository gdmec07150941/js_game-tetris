// 定义Cell类型描述格子
function Cell(r, c, src) {
  this.r = r;
  this.c = c;
  this.src = src;
}
/**
 * 定义父类型Shape 描述图形
 * @param {Number} r0 
 * @param {Number} c0 
 * @param {Number} r1 
 * @param {Number} c1 
 * @param {Number} r2 
 * @param {Number} c2 
 * @param {Number} r3 
 * @param {Number} c3 
 * @param {String} src 
 * @param {Array} states 
 * @param {Number} orgi 
 */
function Shape(r0, c0, r1, c1, r2, c2, r3, c3, src, states, orgi) {
  this.cells = [
    new Cell(r0, c0, src),
    new Cell(r1, c1, src),
    new Cell(r2, c2, src),
    new Cell(r3, c3, src)
  ];
  // 描述图形的旋转状态数组
  this.states = states;
  // 根据下标获得参照格
  this.orgCell = this.cells[orgi];
  // 所有图形的状态: 初始都为0
  this.statei = 0;
}
// 定义图形的下/左/右移动以及旋转
Shape.prototype = {
  // this => 当前图形
  moveDown() { // 下移 => 所有的 r+1
    // 遍历当前图形的cells数组中每个cell
    for (var i = 0; i < this.cells.length; i++)
      this.cells[i].r++; // 将当前cell的 r+1
  },
  moveLeft() { // 左移 => 所有的 c-1
    // 遍历当前图形的cells数组中每个cell
    for (var i = 0; i < this.cells.length; i++)
      this.cells[i].c--; // 将当前cell的 c-1
  },
  moveRight() { // 右移 => 所有的 c+1
    // 遍历当前图形的cells数组中每个cell
    for (var i = 0; i < this.cells.length; i++)
      this.cells[i].c++; // 将当前cell的 c+1
  },
  rotateR() { // 顺时针旋转
    this.statei++; // 将statei+1
    // 如果statei等于状态的个数, 将statei改回0
    this.statei == this.states.length && (this.statei = 0);
    this.rotate();
  },
  rotateL() { // 逆时针旋转
    this.statei--; // 如果statei-1
    // 如果statei等于-1, 将statei改回states.length-1
    this.statei == -1 && (this.statei = this.states.length - 1);
    this.rotate();
  },
  rotate() {
    // 获得states中statei位置的状态对象
    var state = this.states[this.statei];
    // 遍历当前图形的cells中每个格
    for (var i = 0; i < this.cells.length; i++) {
      // 将当前格临时保存在cell中
      var cell = this.cells[i];
      // 如果当前格不是参照格
      if (cell != this.orgCell) {
        // 将cell的r和c, 以参照格的r和c为参照, 进行修正
        cell.r = this.orgCell.r + state["r" + i];
        cell.c = this.orgCell.c + state["c" + i];
      }
    }
  }
}
// 定义状态类型State
function State(r0, c0, r1, c1, r2, c2, r3, c3) {
  this.r0 = r0;
  this.c0 = c0;
  this.r1 = r1;
  this.c1 = c1;
  this.r2 = r2;
  this.c2 = c2;
  this.r3 = r3;
  this.c3 = c3;
}
// 定义子类型T  用以反复创建 T 图形
function T() {
  Shape.call(this, 0, 3, 0, 4, 0, 5, 1, 4, "img/T.png", [
    // 四个状态:
    new State(0, -1, 0, 0, 0, +1, +1, 0),
    new State(-1, 0, 0, 0, +1, 0, 0, -1),
    new State(0, +1, 0, 0, 0, -1, -1, 0),
    new State(+1, 0, 0, 0, -1, 0, 0, +1)
  ], 1);
}
// 设置T的原型继承Shape的原型
Object.setPrototypeOf(T.prototype, Shape.prototype);

// 定义子类型I  用以反复创建 I 图形
function I() {
  Shape.call(this, 0, 3, 0, 4, 0, 5, 0, 6, "img/I.png", [
    // 两个状态:
    new State(0, -1, 0, 0, 0, +1, 0, +2),
    new State(-1, 0, 0, 0, +1, 0, +2, 0)
  ], 1);
}
// 设置I的原型继承Shape的原型
Object.setPrototypeOf(I.prototype, Shape.prototype);

// 定义子类型O  用以反复创建 O 图形
function O() {
  Shape.call(this, 0, 4, 0, 5, 1, 4, 1, 5, "img/O.png", [
    // 1个状态
    new State(0, -1, 0, 0, +1, -1, +1, 0)
  ], 1);
}
// 设置O的原型继承Shape的原型
Object.setPrototypeOf(O.prototype, Shape.prototype);

// 定义子类型L  用以反复创建 L 图形
function L() {
  Shape.call(this, 0, 5, 0, 4, 0, 3, 1, 3, "img/L.png", [
    // 四个状态:
    new State(0, +2, 0, +1, 0, 0, +1, 0),
    new State(+2, 0, +1, 0, 0, 0, 0, -1),
    new State(0, -2, 0, -1, 0, 0, -1, 0),
    new State(-2, 0, -1, 0, 0, 0, 0, +1)
  ], 2);
}
// 设置L的原型继承Shape的原型
Object.setPrototypeOf(L.prototype, Shape.prototype);

// 定义子类型Z  用以反复创建 Z 图形
function Z() {
  Shape.call(this, 0, 3, 0, 4, 1, 4, 1, 5, "img/Z.png", [
    // 2个状态
    new State(-1, -1, -1, 0, 0, 0, 0, +1),
    new State(-1, +1, 0, +1, 0, 0, +1, 0)
  ], 2);
}
// 设置Z的原型继承Shape的原型
Object.setPrototypeOf(Z.prototype, Shape.prototype);

// 定义子类型S  用以反复创建 S 图形
function S() {
  Shape.call(this, 0, 5, 0, 4, 1, 4, 1, 3, "img/S.png", [
    // 2个状态:
    new State(-1, +1, -1, 0, 0, 0, 0, -1),
    new State(+1, +1, 0, +1, 0, 0, -1, 0)
  ], 2);
}
// 设置S的原型继承Shape的原型
Object.setPrototypeOf(S.prototype, Shape.prototype);

// 定义子类型J  用以反复创建 J 图形
function J() {
  Shape.call(this, 0, 3, 0, 4, 0, 5, 1, 5, "img/J.png", [
    // 4个状态
    new State(0, -2, 0, -1, 0, 0, +1, 0),
    new State(-2, 0, -1, 0, 0, 0, 0, -1),
    new State(0, +2, 0, +1, 0, 0, -1, 0),
    new State(+2, 0, +1, 0, 0, 0, 0, +1)
  ], 2);
}
// 设置J的原型继承Shape的原型
Object.setPrototypeOf(J.prototype, Shape.prototype);