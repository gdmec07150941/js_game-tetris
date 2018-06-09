# 俄罗斯方块

[项目预览](index.html)

### 项目目的

为了了解+掌握JavaScript面向对象编程方式与思想

### 项目介绍

```
 - 《俄罗斯方块》的基本规则是移动、旋转和摆放游戏自动输出的各种方块，使之排列成完整的一行或多行并且消除得分。
 ↑ => 顺时针旋转
 ↓ => 加速下落
 ← => 左移
 → => 右移
 p => 暂停
 z => 逆时针旋转
 空格 => 一落到底
```

### 相关技术

```
该项目运用原生JavaScript面向对象方式开发, 其中又以DOM操作为主
```

- HTML + CSS
- JavaScript
  - 函数
    - 原型
    - 继承
    - bind
    - call
  - 对象
    - 属性
    - 方法
  - 内置对象
    - Math
    - Array
    - String
  - webAPI
    - DOM操作
      - 获取页面元素，注册事件
      - 属性操作，样式操作
      - 节点属性，节点层级
      - 动态创建元素
      - 事件：注册事件的方式、事件的三个阶段、事件对象 

---

## 游戏开始

### 构建图形(shape.js)

- 每个图形都由4个小方格组成使用
```
// 定义父类型Shape描述图形
function Shape(r0,c0,r1,c1,r2,c2,r3,c3,src) {
  this.cells = [
    new Cell(r0,c0,src),
    new Cell(r0,c0,src),
    new Cell(r0,c0,src),
    new Cell(r0,c0,src),
  ];
}
// 定义Cell类型描述格子
fucntion Cell(r,c,src) {
  this.r = r;
  this.c = c;
  this.src = src;
}
// 定义子类型 构造函数T, 用以反复创建T图形
function T() {
  // 借用构造函数Shape创建图形 this->新创建的对象
  Shape.call(this,0,3,0,4,0,5,1,4,"img/T.png");
}
// 设置T的原型继承Shape的原型
Object.setPrototypeOf(T.prototype, Shape.prototype);
```

### 构建游戏对象game并绘制图形(tetris.js)

```
var game = {
  OFFSET: 15, // 保存游戏主界面的内边距
  CSIZE: 26, // 保存格子大小(图片的宽高)
  shape: null, // 保存主角图形
  pg: null, // 保存游戏容器
  CN: 10, RN: 20, // 保存最大列数和行数
  start() { // 启动游戏
    // 查找class为playground的div保存在pg属性中
    this.pg = document.getElementsByClassName("playground")[0];
    // 创建一个图形T,保存在shape属性中
    this.shape = new T();
    this.paintShape(); // 绘制主角图形
  }
},
paintShape() {
  // 创建一个文档片段frag
  var frag = document.createElementFragment();
  // 遍历shape中 cells 数组中每个cell
  for(var i = 0; i < this.shape.cells.length, i++) {
    // 将当前cell保存在变量cell中
    var cell = this.shape.cells[i];
    
  }// (遍历结束)
  // 将frag追加到pg属性中
  this.pg.appendChild(frag);
}
paintCell(cell, frag){
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
}
```
这样就完成了图形的构建与绘制了

### 图形下落

- 由于每一个图形都有下落的功能, 所以在构建图形的构造函数Shape的原型上创建一个moveDown方法
```
// 定义图形的下/左/右移动以及旋转
Shape.prototype = {
  // this -> 当前图形
  moveDown() { // 图形下落 => 所有的r+1
    // 遍历当前图形的cells数组中每个cell
    for(var i = 0; i < this.cells.length; i++)
      this.cells[i].r++; // 将当前cell的 r+1
  }
}
```
- 使用周期性定时器使图形每隔interval时间间隔下落一格
  - 在game对象中添加属性`interval: 200`, 表示图形下落的时间间隔
  - 在start方法中添加`setInterval(this.moveDown, this.interval)`
    - **由于定时器中的回调函数**(第一个参数)**只需要函数, 而不会管函数前的this, 所以如果在回调函数里面要使用this(game对象)时, 必须使用`this.moveDown.bind(this)`将game对象(this)绑定到回调函数中**
  - 创建moveDown方法
  ```
  moveDown(){
    this.shape.moveDown(); // 调用shape原型上的moveDown方法
  }
  ```
  - 判断是否可以继续下落(canDown方法)
    - 是否下落到底
      - 循环遍历当前图形的每个给的r是否等于最大行数
      ```
      var cell = this.shape.cells[i];
      cell.r == this.RN // => return false
      ```
    - 是否有图形阻挡
      - 循环判断当前图形的每一个格子的r+1是否有图形
      ```
      var cell = this.shape.cells[i];
      this.wall[cell.r+1][c] !== undefined; // => return false;
      ```
  - 在图形下落之前判定是否能下落
      `if(this.canDown()) this.shape.moveDown();`
  - 不能下落->需要将图形绘制到墙上

### 绘制墙
- 墙面数据
  - 创建landIntoWall方法 => 主角图形落入墙中
  - gamge对象中添加wall属性 `wall: null`
  - 在开始游戏时, 创建RN*CN的二维数组(网格)
    ```
    this.wall = [];
    for(var i = 0; i < this.RN; i++)
      this.wall[i] = new Array(this.CN);
    ```
  - 将cell保存到wall中相同r行c列的位置`this.wall[cell.r][cell.c] = cell;`
- 绘制墙面
  - 创建paintWall方法 => 根据数据绘制墙
  - 自底向上遍历每一行,如果当前行不是空行,再在每一行不为undefined的格中绘制格
    `this.paintCell(this.wall[r][c], frag);`
  - 将frag追加到bg中

### 左移
- 是否可以左移
  - 每个格子左边的r是否为0(到边)
    `cell.c == 0`
  - 每个格子左边是否有格子
    `this.wall[cell.r][cell.c-1] !== undefined;`
- 创建左移方法moveLeft
  - `this.shape.moveLeft();`

**右移同理**

### 消除行(满格行)
- 创建deleteRows方法 => 删除所有满格的行
  - 自底向上遍历每一行
    - 如果当前行是满格,就删除当前行
    ```
    if (this.isFullRow(r)){
       this.deleteRow(r);
       // r留在原地, 继续判断新行是否满格
       r++;
     }
    ```
- 创建deleteRow(r) => 删除第r行
  - 从r行开始,反向遍历每一行
    - 将r-1行赋值给r行 (删除第r行)
      `this.wall[r] = this.wall[r-1];`
    - 将r-1行置为初始状态的CN个元素的空数组
      `this.[r-1] = new Array(this.CN);`
    - 将r行有图形的格子的r+1(r从r-1赋值而来,cell.r为r-1,所以需要+1)
      `this.wall[r][c].r++;`
  - 如果wall中r-2行是空行, 就退出循环
    `this.wall[r-2].join("") == ""`
- 创建isFullRow(r) => 判断第r行是否满格
  - 如果在当前行的字符串中没有找到开头的逗号或者结尾的逗号或者连续两个的逗号, 说明是满格
    `return String(this.wall[r]).search(/^,|,,|,$/) == -1;`

### 图形旋转
- 旋转状态
- 参考格

### 绘制备胎图形

- 调整位置: 需要在paintCell方法中, 将绘制好的img返回出来`return img`, 然后再paintNext方法中接受返回的img对象
  - 然后修改img的top和left: 
   ```
   // 创建文档片段frag
   var frag = document.createDocumentFragment();
   // 遍历nextShape中每个cell
   for(var i = 0; i < this.nextShape.cells.length; i++){
     var cell = this.nextShape.cells[i];
     var img = this.paint(cell, frag);
     // left距离原图左边为10*PSIZE, top距离原图上边为CSIZE
     img.style.left = parseFloat(img.style.left) + 10 * this.CSIZE + "px";
     img.style.top = parseFloat(img.style.top) + this.CSIZE + "px";
   }
   // 将frag追加到pg中
   this.pg.appendChild(img);
   ```

- 备胎转正:
  - 在moveDown方法中,判断主角图形下落到底之后, 将备胎图形赋值给主角图形, 然后再重新生成一个备胎图形
    ```
    this.shape = this.nextShape;
    this.nextShape = this.randomShape();
    ```