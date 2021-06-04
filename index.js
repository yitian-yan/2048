let project = {
    //得分
    score: 0,
    //data 保存数据 4x4 二维数组
    data: [],
    //游戏开始
    start: function() {
        //初始化分数
        this.score = 0;
        //初始化 data 数据
        for(let j=0;j<4;j++){
            let data_row = [];
            for(let i=0;i<4;i++){
                data_row[i] = 0;
            }
            this.data[j] = data_row;
        }
        //初始生成两个2
        this.first_create_random_number();
        this.first_create_random_number();
        //展示到页面中
        this.showInView();
        // console.log(String(this.data))

    },
    //初始生成1个2
    first_create_random_number: function() {
        let x = Math.floor(Math.random()*this.data.length);
        let y = Math.floor(Math.random()*this.data.length);
        if(this.data[x][y] == 0){
            this.data[x][y] = 2;
        }else{
            this.first_create_random_number();
        }
        // this.score = 4;
    },
    //后续生成一个 2 或者 4
    creat_random_num: function() {
        let x = Math.floor(Math.random()*this.data.length);
        let y = Math.floor(Math.random()*this.data.length);
        if(this.data[x][y] == 0){
            this.data[x][y] = Math.random()<0.5 ? 2 : 4;
        }else{
            this.creat_random_num();
        }
    },
    // 将数组渲染成元素
    showInView: function() {
        //获取单个格子的值与元素
        for(let x=0;x<4;x++){
            for(let y=0;y<4;y++){
                if(this.data[x][y] == 0){
                    document.getElementById('square'+x+y).innerHTML = '';
                    document.getElementById('square'+x+y).className = 'grid n'+this.data[x][y];
                }else{
                    document.getElementById('square'+x+y).innerHTML = this.data[x][y];
                    document.getElementById('square'+x+y).className = 'grid n'+this.data[x][y];
                }
            }
        }
        document.getElementById('score').innerHTML = this.score;
    },
    isEnd: function() {
        /*结束有2个条件
        1.数组所有元素不为0
        2.上下左右相邻元素不相等*/
        for(let x=0;x<4;x++){
            for(let y=0;y<4;y++){
                if(this.data[x][y] == 0)return false;
                if(x<3){
                    if(this.data[x][y] == this.data[x+1][y])return false;
                }
                if(y<3){
                    if(this.data[x][y] == this.data[x][y+1])return false;
                }
            }
        }
        return true;
    },
    isWin: function() {
        //获胜条件为有一个数据为2048
        for(let x=0;x<4;x++){
            for(let y=0;y<4;y++){
                if(this.data[x][y] == 2048) return true;
            }
        }
        return false;
    },
    isGameOver: function(b,a) {
        if(b != a){
            this.creat_random_num();
            if(this.isEnd()) {
                document.getElementById('total_score').innerHTML = this.score;
                document.getElementById('total_title').innerHTML = 'You lose the game !';
                document.getElementById('alertBox').style.display = 'block';
            }
            if(this.isWin()) {
                document.getElementById('total_score').innerHTML = this.score;
                document.getElementById('total_title').innerHTML = 'You win ! ! !';
                document.getElementById('alertBox').style.display = 'block';
            }
            this.showInView();
        }
    },
    getNextRow: function(x,y){
        for(let i=x+1;i<4;i++){
            //从x+1 开始循环，如果不为0则返回X下标，否则返回 -1
            if(this.data[i][y] != 0)
            return i;
        }
        return -1;
    },
    moveUpCol: function(y) {
        //循环每一列，因为是向上移动，所以检查下面的元素是否为0
        for(let x=0;x<3;x++){
            // let nextX = this.getNextRow(x,y);
            this.checkCellByCol(x,y,this.getNextRow(x,y))
        }
    },
    moveUp: function() {
        // 将移动前的数组保存为一个字符串
        let beforeArray = this.data.toString();
        //向上移动是按列移动
        //每列有四个元素
        // console.log(beforeArray);
        for(let y=0;y<4;y++){
            this.moveUpCol(y);
        }
        let afterArray = this.data.toString();
        this.isGameOver(beforeArray,afterArray);
    },
    checkCellByCol: function(x,y,nextX) {
        if(nextX == -1 ){//如果返回-1则说明下面没有元素了
            // break;
            return;
        }else if( this.data[x][y] == 0){//如果自身为0，则将下面的值交给自己，下面的元素置为空
            this.data[x][y] = this.data[nextX][y];
            this.data[nextX][y] = 0;
            x--;//重复上述过程
        }else if( this.data[x][y] == this.data[nextX][y]){ 
            //如果两者相等，则相加
            //并将值保存到score
            this.data[x][y] *= 2;
            this.score += this.data[x][y];
            this.data[nextX][y] = 0;
        }
    },
    moveDown: function() {
        // 将移动前的数组保存为一个字符串
        let beforeArray = this.data.toString();
        //向下移动是按列移动
        //每列有四个元素
        // console.log(beforeArray);
        for(let y=0;y<4;y++){
            this.moveDownCol(y);
        }
        let afterArray = this.data.toString();
        this.isGameOver(beforeArray,afterArray);
    },
    moveDownCol: function(y) {
        for(let x=3;x>0;x--){
            this.checkCellByCol(x,y,this.getPreRow(x,y));
        }
    },
    getPreRow: function(x,y) {
        for(let i = x-1;i>=0;i--){
            if(this.data[i][y] != 0)
            return i;
        }
        return-1
    },
    moveLeft: function() {
        // 将移动前的数组保存为一个字符串
        let beforeArray = this.data.toString();
        //向左移动是按列移动
        //每行有四个元素
        // console.log(beforeArray);
        for(let x=0;x<4;x++){
            this.moveLeftRow(x);
        }
        let afterArray = this.data.toString();
        this.isGameOver(beforeArray,afterArray);
    },
    moveRight: function() {
        // 将移动前的数组保存为一个字符串
        let beforeArray = this.data.toString();
        //向右移动是按列移动
        //每行有四个元素
        // console.log(beforeArray);
        for(let x=0;x<4;x++){
            this.moveRightRow(x);
        }
        let afterArray = this.data.toString();
        this.isGameOver(beforeArray,afterArray);
    },
    moveLeftRow: function(x) {
        for(let y=0;y<3;y++){
            this.checkCellByRow(x,y,this.getNextCol(x,y));
        }
    },
    moveRightRow: function(x) {
        for(let y=3;y>=0;y--){
            this.checkCellByRow(x,y,this.getPreCol(x,y));
        }
    },
    checkCellByRow: function(x,y,nextY) {
        if(nextY == -1){
            return;
        }else if(this.data[x][y] == 0){
            this.data[x][y] = this.data[x][nextY];
            this.data[x][nextY] = 0;
        }else if(this.data[x][y] == this.data[x][nextY]){
            this.data[x][y] *= 2;
            this.score += this.data[x][y];
            this.data[x][nextY] = 0;
        }
    },
    getNextCol: function(x,y){
        for(let i=y+1;i<4;i++){
            if(this.data[x][i] != 0)
            return i;
        }
        return -1;
    },
    getPreCol: function(x,y){
        for(let i=y-1;i>=0;i--){
            if(this.data[x][i] != 0)
            return i;
        }
        return -1;
    }
}
//键盘操作
document.onkeydown=function(event){
    //按下左键向左移动
    if(event.keyCode==37){
        project.moveLeft();
    }
    //按下向上键向上移动
    if(event.keyCode==38){
        project.moveUp();
    }
    //按下右键向右移动
    if(event.keyCode==39){
        project.moveRight();
    }
    //按下向下键向下移动
    if(event.keyCode==40){
        project.moveDown();
    }
    //按下空格键重新开始游戏
    if(event.keyCode==32){
        project.start();
    }
}
//restart
function restartGame() {
    if(confirm('是否要重新开始游戏')){
        project.start();
        document.getElementById('board').focus();
    } 
}
function startGameAgain(){
    project.start();
    document.getElementById('alertBox').style.display = 'none';
}
function flushView() {
    project.start();
}
