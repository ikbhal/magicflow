
//extra featues bridge
//big board 5,6,7,8,9, for ipad {10, 11, 12, 13, 14}
//dailog congratuation, getHints

var colors = [  [0,0,0,255]
                ,[0, 0, 0, 255]
                ,[255,  0,  0,255] //red 
                ,[  0,255,  0,255] //green
                ,[  0,  0,255,255] //blue
                ,[255,255,  0,255]//yellow
               ,[255,165,  0,255] //orange
               //light blue
               //pink
               //meroon
               //white
               //grey
               //magenta or dark pinl
               //light reen
               //light yellow
            ];

var colorStart = 1;
var eColor = {
    EMPTY: colorStart,
    RED: colorStart + 1,
    GREEN: colorStart + 2,
    BLUE: colorStart + 3,
    YELLOW: colorStart + 4,
    ORANGE: colorStart + 5

};
var gboard;
var CircleSprite = cc.Sprite.extend({
    _degree:0,
    ctor:function () {
        this._super();
    },
    draw:function () {
        cc.drawingUtil.setDrawColor4B(255,255,255,255);

        if (this._degree < 0)
            this._degree = 360;
        cc.drawingUtil.drawCircle(cc.PointZero(), 30, cc.DEGREES_TO_RADIANS(this._degree), 60, true);
    },
    myUpdate:function (dt) {
        this._degree -= 6;
    }
});
//cc.FileUtils.getInstance().loadFilenameLookup('FileUtils/lookup-html5.plist');

var BoardSprite = cc.Sprite.extend({
    _size:4,
    _side:400,
    _data:null,
    _noItems:6,
    _cellSide:0,
    _itemRad:0,
    _itemSelectRad:0,

    _levelName:"Level1",
    //stats
    _AlreadyCompleted:false,
    _flows: 0,
    _moves:0,
    _best:0,
    _pipe:0,
    
    _ri: 0,
    _ci:0,
    _eri:0,
    _eci: 0,
    _formType: 12,
    _itemTypes:5,
    _lastSelectItemType: -1,
    _empty: -1,
    _invalid:-2,
    _draw: null,
    _noInitialUnFilledCells: 0,
    _noUnfilledCells:0,
    _pipePerCell: 0,
    _nexts:null,
    _prevs: null,
    _totalPipes:0,
    _pipesUsed:0,
    _pipePercentage:0,
    //ctor:function (data, size,itemTypes, side) {
    ctor:function (data, side) {
        this._super();
        cc.log("inside board ctor");
        this._draw = cc.DrawNode.create();
        this.addChild( this._draw, 10 );
        
        //this.setLevelData(data);

        // if(size){
        //     this._size = size;
        // }
        if(side){
            this._side = side;
        }
        //this._itemTypes = itemTypes;
        this.setLevelData(data);
        this._itemTypes = this.getItemTypesInBoard();
        // this._totalPipes = (this._size * this._size) -this._itemTypes;
        // cc.log("totalPipes:" + this._totalPipes);

        // this._cellSide = this._side / this._size;
        // this._itemRad = this._cellSide * 0.3;
        // this._itemSelectRad = this._cellSide * 0.4;

        // cc.log("size:" + this._size + ";side:" + side + ";cellSide:" 
        //     + this._cellSide + ";itemRad:" + this._itemRad 
        //     + ";itemSelectRad:" + this._itemSelectRad);

        //this.setLevelData(data);
    },setLevelData: function(data){
        //cc.log("inside setLevelData datap:" + data);
        if(typeof(data) ==='undefined' ){
            cc.log("*******can not load level data *********");
            return ;
        }
        //cc.log("data is given in top to down => down to up ");
        //cc.log("convert 0 to empty(-1), red (1) => 0 , green(2) => 12, b(3)=>24, y(4)=>36, o(5)=>48");
        //this._data = data;
        this._size = data.length;
        this._data = [];
        this._nexts = [];
        this._prevs = [];
        this._noUnfilledCells = 0;
        for(var i=0;i < this._size;i++){
            this._data[i] = [];
            this._nexts[i] = [];
            this._prevs[i] = [];
            for(var j=0;j<this._size;j++){
                this._data[i][j] = 0;
                this._nexts[i][j] = cc.p(-1,-1);
                this._prevs[i][j] = cc.p(-1,-1);
                 if(data[i][j] == 0){
                     this._noInitialUnFilledCells = this._noInitialUnFilledCells + 1;
                 }
            }
        }

        // var assoc = new Object();
        // assoc[1] = 2;
        // assoc[3]= 5;
        // console.log("assoc:"+assoc);
        // console.log("length:"+ Object.keys(assoc).length);
        // for(var i in assoc){
        //    console.log("i:"+ i + ";val:" + assoc[i]);
        // }


        for(var i=0;i < this._size;i++){
            for(var j=0;j<this._size;j++){
                this._data[j][i] = (data[this._size-1-i][j] == 0 ? -1: (this._formType * (data[this._size-1-i][j]-1)) );
            }
        }

        this._totalPipes = (this._size * this._size) -this._itemTypes;
        //cc.log("totalPipes:" + this._totalPipes);

        this._cellSide = this._side / this._size;
        this._itemRad = this._cellSide * 0.3;
        this._itemSelectRad = this._cellSide * 0.4;

        //cc.log("size:" + this._size + ";side:" + this._side + ";cellSide:" 
        //    + this._cellSide + ";itemRad:" + this._itemRad 
        //    + ";itemSelectRad:" + this._itemSelectRad);
    },getItemTypesInBoard:function(){
        //cc.log("getItemTypesInBoard");
        if(this._data == null || !this._data || typeof(this._data) === 'undefined'){
            return ;
        }
        var assoc = new Object();
        var num;
        for(var i=0;i<this._size;i++){
            for(var j=0;j<this._size;j++){
                num = this._data[i][j];
                assoc[num] = 1;
            }
        }
        return Object.keys(assoc).length - 1 ;
    },printBoard: function(){
        cc.log("board.data:");
        for(var i=0;i<this._size;i++){
            cc.log(this._data[i]);
        }
    },getPipePercentage:function(){
        return this._pipePercentage;
    //     //cc.log("inside getPipePercentage");
    //     this._noUnfilledCells = 0;
    //     for(var i=0;i<this._size;i++){
    //         for(var j=0;j<this._size;j++){
    //             if(this._data[i][j] == -1){
    //                 this._noUnfilledCells = this._noUnfilledCells + 1;
    //             }
    //         }
    //     }

    //     return Math.ceil(this._noUnfilledCells/ this._noInitialUnFilledCells * 100);
    },
    draw:function () {
        this.drawBoard();
    },getCompletedFlows: function(){
        //cc.log("getCompletedFlows");
        var nf = 0;
        var it;
        var ft;
        var iarr = new Array(10);
        for(var i=0;i<10;i++){
            iarr[i]=0;
        }
        for(var i=0;i<this._size;i++){
            for(var j=0;j<this._size;j++){
                it = this.getItemType(i,j);
                ft = this.getFormType(i,j);
                if(ft == 1){
                    iarr[it]++;
                }
            }
        }
        for(var i=0;i<10;i++){
            if(iarr[i] >=2){
                nf++;
            }
        }
        cc.log("nf:" + nf);
        return nf;
    },
    getColorArray: function(colorNo) {
        if(colorNo>-1 && colorNo < colors.length){
            return colors[colorNo+1];
        }
        return colors[1];
    },getColorNoFromData: function (d){
        if( d != -1){
            return Math.floor(d / this._formType) + 1;
        }else{
            return d;
        }
    },setLastSelectItemType: function(itype){
        cc.log("inside setLastSelectItemType:" + itype);
        if(itype >-1){
            if(this._lastSelectItemType  != itype){
                cc.log("_lastSelectItemType:" + this._lastSelectItemType + " is differen from " + itype);
                this._moves ++;
                cc.log("inrease moves , now moves:" + this._moves);
                this._lastSelectItemType = itype;
            }
        }
    },
    randomItem: function(){
        return Math.floor(Math.random() * this._noItems);
    },drawSolidCircle: function(r, c){

        //this._draw.drawDot( cc.p(200, 200), 150, cc.c4f( 1,0,0, 1) );
        var cx, cy, rad, cr, cg, cb, co;

        //changing r, c for correct order
        cx = (r + 0.5) * this._cellSide;
        cy = (c + 0.5) * this._cellSide;
        
        var colorNo = this.getColorNoFromData(this._data[r][c]);
        //cc.log("colorNo in drawSC:" + colorNo);
        var colorArr = this.getColorArray(colorNo);
        if(colorArr){
        //cc.log("solidCircle: colorArr:" + colorArr);
            cr = colorArr[0]/255.0;
            cg = colorArr[1]/255.0;
            cb = colorArr[2]/255.0;
            co = colorArr[3]/255.0;
        }else{
            cr = 0;
            cg  =0;
            cb = 0;
            co = 1;
        }

        this._draw.drawDot( cc.p(cx, cy), this._itemRad, cc.c4f( cr,cg, cb, 1) );
    },drawSolidCellCircle: function(r, c){
        drawSolidCircle(r,c);
    },drawSolidLightCell: function (r, c){
        var cs = this._cellSide;
        var x1,y1, x2, y2;
        
        x1 = c * cs +1 ;
        x2 = (c+1) * cs-1;
        y1 = r * cs + 1;
        y2 = (r+1) * cs -1;
        
        var colorNo = this.getColorNoFromData(this._data[r][c]);
        //cc.log("colorNo in drawSC:" + colorNo);
        var colorArr = this.getColorArray(colorNo);
        if(colorArr ){
            cr = colorArr[0];
            cg = colorArr[1];
            cb = colorArr[2];
            //light cell , reducing by half
            co = colorArr[3]/4;
        } else {
            cr = 0;
            cg = 0;
            cb = 0;
            co = 255;
        }
        
        cc.drawingUtil.setDrawColor4B(cr,cg,cb,co);
        cc.drawingUtil.drawSolidRect(cc.p(y1,x1), cc.p(y2,x2));
    },drawLightCellSolidCircle: function(r, c){
        //cc.log("drawLightCellSolidCircle");
        this.drawSolidLightCell(r,c);
        this.drawSolidCircle(r,c);
    },getDirection: function(r, c){
        var itype = this._data[r][c] / this_formType;
        var dirs =[[r+1, c],[r, c+1], [r-1,c], [r, c-1]];
        var r2, c2;
        var dirNo = 0;
        for(var i=0;i<dirs.length;i++){
            r2 = dirs[i][0];
            c2 = dirs[i][1];
            if(this.sameItemType(r,c, r2, c2)){
                break;
            }
            dirNo++;
        }
        return dirNo+1; //1 index  1=top, 2=right, 3=down, 4= left , clock wise
    },validCellIndex:function(r, c){
        if(r >=0 && r < this._size && c >=0 && c < this._size){
            return true;
        }else {
            return false;
        }
    }, sameItemType:function(r1, c1, r2, c2){
        var it1 = this.getItemType(r1, c1);
        var it2 = this.getItemType(r2, c2);
        //cc.log("sameItemType: r1:" + r1 + ";c1:" + c1 + ";r2:" + r2 + ";c2:" + c2 + ";it1:" + it1 + ";it2:" + it2) ;
        if(this.getItemType(r1, c1) == this.getItemType(r2, c2)){
            return true;
        }
        return false;
    }, getSelectItemType: function(){
        var selecctItemType = -1;
        if(this._eri >=0 && this._eci >=0){
            selectItemType = this.getItemType(this._data[this._eri][this._eci]);
        }
        return selectItemType;
    }, getSelectedFlowItemType: function(){
        return this.getItemType(this._eri, this._eci);
    },getItemType: function (r, c){
        //cc.log("getItemType: r:" + r + ";c:" + c)
        if(!this.validCellIndex(r,c))
            return -1;

        var itype = Math.floor(this._data[r][c] / this._formType);
        //cc.log("getItemType: r:" + r + ";c:" + c + ";itype:" + itype);
        return itype;
    }, getFormType: function(r,c){
        if(!this.validCellIndex(r,c))
            return -1;
        var ftype = this._data[r][c] % this._formType;
        return ftype;
    },getNormalItemNo: function(ifno){
        cc.log("getNormalItemNo:" + ifno);
        return Math.floor(ifno / this._formType) * this._formType;
    }, getHighligtedItemNo: function(ifno){
        return this.getNormalItemNo(ifno) + 1;
    }, getJoinCommonItemNo: function(ifno){
        cc.log("getJoinCommonItemNo:" + ifno);
        return this.getNormalItemNo(ifno) + 2;
    }, resetEndCell: function(){
        this._eri = -1;
        this._eci = -1;
    }, setLink: function(r1, c1, r2, c2){
        if(this.validCellIndex(r1,c1)){
            this._nexts[r1][c1] = cc.p(r2,c2);
            if(this.validCellIndex(r2,c2)){
                this._prevs[r2][c2] = cc.p(r1, c1);
            }
        }
    }, unLink: function(r1, c1){
        cc.log("unlink r1:" + r1 + ";c1:" + c1);
        if(this.validCellIndex(r1,c1)){
            var np = this._nexts[r1][c1];
            this._nexts[r1][c1] = cc.p(-1, -1);
            if(this.validCellIndex(np.x, np.y)){
                this._prevs[np.x][np.y] = cc.p(-1, -1);
            }   

            var pp = this._prevs[r1][c1];
            this._prevs[r1][c1] = cc.p(-1, -1);
            if(this.validCellIndex(pp.x, pp.y)){
                this._nexts[pp.x][pp.y] = cc.p(-1, -1);
            }
        }
    },isFlowComplete: function(){
        cc.log("inside isFlow Complete");
        var ret = false;
        var r =this._eri, c = this._eci;
        var noEnds = 0;
        var ftype;
        var prev;
        while(this.validCellIndex(r,c)){
            ftype = this.getFormType(r,c) ;
            if(ftype == 1){
                noEnds ++;
                if(noEnds >=2){
                    ret = true;
                    break;
                }
            }
            prev = this._prevs[r][c];
            r = prev.x;
            c = prev.y;
        }
        return ret;
    },setEndCell: function(r, c, setNextFlag){
        if(typeof(setNextFlag)==='undefined'){
            setNextFlag = true;
        }
        cc.log("setEndCell to r:" + r + ";c:" + c + " from eri:" + this._eri
             + "; eci:" + this._eci + ";setNextFlag:" + setNextFlag);
        if(this.validCellIndex(this._eri, this._eci)){
            cc.log("setting erc next rc");
            if(setNextFlag){
                this.setLink(this._eri, this._eci, r, c);
                // this._nexts[this._eri][this._eci] = cc.p(r,c);
                // if(this.validCellIndex(r,c)){
                //     this._prevs[r][c] = cc.p(this._eri, this._eci);
                //     cc.log("prevs rc:" + this._nexts[r][c]);
                // }

            }else{
                this.unLink(this._eri, this._eci);
                // var np = this._nexts[this._eri][this._eci];
                // this._nexts[this._eri][this._eci] = cc.p(-1, -1);
                // if(this.validCellIndex(np.x, np.y)){
                //     this._prevs[np.x][np.y] = cc.p(-1, -1);
                //     cc.log("prevs np:" + this._nexts[np.x][np.y]);
                // }
            }
            cc.log("nexts erc:" + this._nexts[this._eri][this._eci]);
        }
        //this._nexts[r][c] = cc.p(-1, -1);
        //this.unLink(r,c);
        this._eri = r;
        this._eci = c;
    }, setJoinCell: function(r, c){
        cc.log("setJoinCell for cell r:" + r + ",c:" + c);
        this._eri = r;
        this._eci = c;
    },nextLinkExist: function(r, c){
        cc.log("inside nextLinkExist for cell r:" + r + ".c:" + c);
        var ret = false;
        if(this.validCellIndex(r,c)){
            var p = this._nexts[r][c];
            var r2 = p.x;
            var c2 = p.y;
            if(this.validCellIndex(r2,c2)){
                ret = true;
            }
        }
        return ret;
    },printNextTable: function(){
        this.printPointTable("printNextTable", this._nexts);
    },printPrevTable: function(){
        this.printPointTable("printPrevTable", this._prevs);
    },printPointTable: function(msg, ptable){
        cc.log(msg);
        if(typeof(ptable) ==='undefined'){
            cc.log("undefined ptable");
            return;
        }
        if(ptable && ptable.length<1){
            cc.log("empty table");
            return ;
        }
        var t= "";
        var nr = ptable.length;
        var nc = ptable[0].length;
        for(var i=0;i<nr;i++){
            for(var j=0;j<nc;j++){
                t = t + "(" + ptable[i][j].x + "," + ptable[i][j].y + ") ";
            }
            t  = t + "\n";
        }
        cc.log(t);
    }
    ,drawBorderCircle: function(r,c){
        cc.log("inside drawBorderCirlce r:" + r + ";c:" + c);
       var cs = this._cellSide;
        var x1,y1, x2, y2;
        
        x1 = c * cs ;
        x2 = (c+1) * cs;
        y1 = r * cs;
        y2 = (r+1) * cs;
        
        var colorNo = this.getColorNoFromData(this._data[r][c]);
        //cc.log("colorNo in drawSC:" + colorNo);
        var colorArr = this.getColorArray(colorNo);
        if(colorArr ){
            cr = colorArr[0];
            cg = colorArr[1];
            cb = colorArr[2];
            //light cell , reducing by half
            co = colorArr[3]/2;
        } else {
            cr = 0;
            cg = 0;
            cb = 0;
            co = 255;
        }
        
        cc.drawingUtil.setDrawColor4B(cr,cg,cb,co);
        cc.drawingUtil.drawRect(cc.p(y1,x1), cc.p(y2,x2));
    },drawSegmentBtn2Cell: function(r1,c1, r2, c2, cr, cg, cb, co){
        //cc.log("drawSegment: r1:" + r1  + ";c1:" + c1 + ";r2:" + r2 + ";c2:"  + c2 + ";cr:" + cr + ";cg:" + cg + ";cb:" + cb + ";co:" + co);
        
        if(cr ==0 && cg==0 && cb ==0 ){
            cc.log("cr, cg, cb are zero");
            return ;
        }
        var x1, y1, x2, y2;

        if(r1 == r2){ // horizontal
            y1 = y2 = (r1 +0.5) * this._cellSide;
            x1 = (c1 + 0.5) * this._cellSide;
            x2 = (c2 + 0.5) * this._cellSide;
        }else if (c1 == c2){ //vertical
            x1= x2 = (c1 + 0.5) * this._cellSide;
            y1 = (r1 + 0.5) * this._cellSide;
            y2 = (r2 + 0.5) * this._cellSide;
        }
        var segWidth = this._itemRad *.6;
        cr = cr/255.0;
        cg = cg/255.0;
        cb = cb/255.0;
        co = co/255.0;

        //swap x1, y1
        var temp = x1;
        x1 = y1;
        y1 = temp;

        temp = x2;
        x2 = y2;
        y2 = temp;

        //swap p1, p2 if  p1.x > p2.x or p1.y > p2.y
        if(x1> x2 || y1 > y2){
            //swap p1, p2
            var temp = x1;
            x1 = x2;
            x2 = temp;

            temp = y1;
            y1 = y2;
            y2 = temp;
        }
        //swapping 
        this._draw.drawSegment( cc.p(x1, y1), cc.p(x2,y2), segWidth, cc.c4f(cr, cg, cb, co) );
    },
    drawCellSegment:function(r, c, dir, cr, cg, cb, co){

    },drawPipes: function(){
        //cc.log("inside drawPipes");
        var r1, c1, r2, c2, cr, cg, cb, co;
        var p;
        var carr ;
        this._pipesUsed = 0;
        for(var i=0;i<this._size;i++){
            for(var j=0;j<this._size;j++){
                p = this._nexts[i][j];
                if(this.validCellIndex(p.x, p.y)){
                    r1 = i; c1 = j; 
                    r2 = p.x; c2 = p.y;

                    carr = this.getColorArray(this.getColorNoFromData(this._data[i][j]));
                    if(carr){
                        cr = carr[0];
                        cg = carr[1];
                        cb = carr[2];
                        co = carr[3];
                    }else{
                        cr = cg = cb = 0;
                        co = 255;
                    }
                    this.drawSegmentBtn2Cell(r1, c1, r2, c2, cr, cg, cb, co);
                    this._pipesUsed++;
                }
            }
        }
        this._pipePercentage = Math.floor(100 * this._pipesUsed/this._totalPipes);
    },
    drawSegmentIfPossible: function (r,c){
        //cc.log("drawSegmentIfPossible r:" + r + ":c" + c);
        var dirs =[[r-1, c],[ r, c-1]];
        var r2, c2;
        var cr, cg, cb, co;
        var colorArr = this.getColorArray(this.getColorNoFromData(this._data[r][c]));
        //cc.log("dsip: colorArr:" + colorArr);
        if(colorArr){
            cr = colorArr[0];
            cg = colorArr[1];
            cb = colorArr[2];
            co = colorArr[3];
        }else{
            cc.log("no colorArr");
        }
        for(var i=0;i<dirs.length;i++){
            r2 = dirs[i][0];
            c2 = dirs[i][1];
            //cc.log("r2:" +r2 + " :c2:" + c2 + " sameItemType or not:" + this.sameItemType(r,c, r2, c2));
            if(this.sameItemType(r,c, r2, c2) && this.getFormType(r2, c2) >0 && this.getFormType(r, c) >0){
                this.drawSegmentBtn2Cell(r, c, r2, c2, cr, cg, cb, co);
                break;
            }
        }
        
    },sameItemTypeNeighbour: function(r,c){
        cc.log("inside sameItemTypeNeighbour r:" + r + ";c:" + c);
        var dirs = [[r+1,c],[r-1,c],[r,c+1],[r,c-1]];
        var r2,c2;
        var itype = this.getItemType(r,c);
        for(var i=0;i<dirs.length;i++){
            r2 = dirs[i][0];
            c2 = dirs[i][1];
            if(this.validCellIndex(r2,c2) && this.getItemType(r2,c2) == itype){
                return true;
            }
        }
        return false;
    },
    drawBoard: function(){
        if(this._data == null || !this._data || typeof(this._data) === 'undefined'){
            cc.log("board level data is not yet set");
            return ;
        }
        this.removeChild(this._draw);
        this._draw =   cc.DrawNode.create();
        this.addChild( this._draw, 10 );
        var ws = cc.Director.getInstance().getWinSize();
        cc.drawingUtil.setDrawColor4B(255,255,0,255);
        var cs = this._cellSide;
        var x1,y1, x2, y2;
        var cr,cg, cb;
        var colorArr = [];
        var colorNo;
        for(var i=0;i<this._size;i++){
            for(var j=0;j<this._size;j++){
                x1 = i * cs ;
                x2 = (i+1) * cs;
                y1 = j * cs;
                y2 = (j+1) * cs;

                cc.drawingUtil.setDrawColor4B(255,255,0,255);
                cc.drawingUtil.drawRect(cc.p(x1,y1), cc.p(x2,y2));

                cx = (x1 + x2) / 2;
                cy = (y1 + y2) / 2;
                colorNo = (this._data[i][j] ==-1 ? -1 : (this._data[i][j] /12 + 1));
                colorArr = this.getColorArray(colorNo);
                if(colorArr){
                    cr = colorArr[0];
                    cg = colorArr[1];
                    cb = colorArr[2];
                    co = colorArr[3];
                }else{
                    cr = 0;
                    cg = 0;
                    cb = 0;
                    co = 0;
                }
                if(this._data[i][j] == -1){

                }else{
                    var formType = this.getFormType(i,j);
                    var itemType = this.getItemType(i,j);

                    // if(formType > 0){
                    //     this.drawSolidLightCell(i,j);
                    // }
                    switch(formType){
                        case 0: //only solid circle
                            this.drawSolidCircle(i,j);
                            break;
                        case 1: //only solid cirlce, light cell
                            this.drawLightCellSolidCircle(i,j);
                            break;
                        case 2:
                            if(this.getItemType(i,j) != this.getSelectedFlowItemType()) {
                                this.drawSolidLightCell(i,j);
                            }
                            break;
                    }
                    
                    //interchange positio as board is swap
                    //this.drawSegmentIfPossible(i, j);
                }
            }
        }
        this.drawPipes();
    },rowColIndex: function (touches, event){
            var x, y;
            if(touches && touches != null && touches.length >0){
                x = touches[0].getLocation().x - this.getPosition().x;
                y = touches[0].getLocation().y - this.getPosition().y;
                //cc.log("board touch point x:" + x + " ;y:" + y);
                //swapping on purpose as data in also swapped
                this._ci = Math.floor(y /this._cellSide);
                this._ri = Math.floor(x / this._cellSide);

                cc.log("board cell select ri:" + this._ri + ";ci:" + this._ci);
            }
    },clearFlow: function(ri, ci){
        cc.log("clearFlow ri:" + ri + ";ci:" + ci);
        var itype = this.getItemType(ri,ci);
        var itemNo = this.getNormalItemNo(this._data[ri][ci]);
        var hitemNo = this.getHighligtedItemNo(this._data[ri][ci]);

        cc.log("itemNo:" + itemNo);
        for(var i=0;i<this._size;i++){
            for(var j=0;j<this._size;j++){
                if(this.getItemType(i,j) ==  itype){
                    //this._nexts[i][j] = cc.p(-1, -1);
                    this.unLink(i,j);
                    if(this.getFormType(i,j) >1){
                        this._data[i][j] = this._empty;
                    }else if(this.getFormType(i,j) == 1){
                       this._data[i][j] = itemNo;
                    }
                }
            }
        }
        this._data[ri][ci] = hitemNo;
        cc.log("[rici]:" + this._data[ri][ci]);
    },clearFlowFromSelectedCell: function(r, c){
        cc.log("clearFlowFromSelectedCell r:" + r + ";c:" + c);
        var p = null;
        var r
        if(this.validCellIndex(r,c)){
            p = this._nexts[r][c];
        }
        while(this.validCellIndex(r,c)){
            //this._nexts[r][c] = cc.p(-1, -1);
            this.unLink(r,c);
            this.clearPipeAndSelectionOnly(r,c);
            //this._data[r][c]= this._empty;
            r = p.x;
            c = p.y;
            this.clearPipeAndSelectionOnly(r,c);

            if( p && this.validCellIndex(r, c)){
                p = this._nexts[r][c];
            }
        }
    },clearPipeAndSelectionOnly: function(r, c){
        cc.log("inside clearPipeonly:r : " + r + ";c:" + c);
        if(this.validCellIndex(r,c)){
            cc.log("ftype:" + this.getFormType(r,c));
            if(this.getFormType(r,c) >1){
                this._data[r][c]= this._empty;
            }else if(this.getFormType(r,c) == 1){
                this._data[r][c]= this.getNormalItemNo(this._data[r][c]);
            }
            cc.log("rc:" + this._data[r][c]);
        }
    },
    onTouchesBegan:function (touches, event) {
        this.printBoard();
        cc.log("otb:current flow itype:" + this.getItemType(this._eri, this._eci));
        //this.drawSegmentBtn2Cell(2, 2,  2, 3, 255, 0, 0, 255);
        console.log("board.onTouchesBegan");
        this.rowColIndex(touches, event);
        var ri, ci;
        ri = this._ri;
        ci = this._ci;
        var p;
        if(ri < this._side && ci < this._side && ri>=0 && ci>=0){
            cc.log("cell:" + this._data[ri][ci] + ";reverse cell:" + this._data[ci][ri]);
            this.setLastSelectItemType(this.getItemType(this._data[ri][ci]))
            if(this.getFormType(ri,ci) == 0 || this.getFormType(ri,ci) == 1) // cell with circle, light cell
            {
                this._moves ++;

                this.clearFlow(ri, ci);
                this.resetEndCell();
                this.setEndCell(ri,ci);
                //p = this._nexts[ri][ci];
                //if(this.validCellIndex(p.x, p.y) || this.sameItemTypeNeighbour(ri,ci)){
                //   this.clearFlow(ri, ci); 
                //}//else{
               //      cc.log("Valid cell2");
               //      this.setEndCell(ri,ci);
               //      this._data[ri][ci] = this.getHighligtedItemNo(this._data[ri][ci]);
               //      cc.log("eri:" + this._eri + ";eci:" + this._eci);
               // }
                
            }else if(this.getFormType(ri,ci) >1 ){
                if(!this.nextLinkExist(ri,ci)){
                    //this.setJoinCell(ri,ci);
                    this.resetEndCell();
                    this.setEndCell(ri,ci);
                }else{
                    var np = this._nexts[ri][ci];
                    this.clearFlowFromSelectedCell(np.x, np.y);
                }
            }
            else if(this._data[ri][ci] != this._empty){
                cc.log("Valid cell");
                this.setEndCell(ri,ci);
                //this._eri = ri;
                //this._eci = ci;
                //var itype = this._data[ri][ci] / this._formType;
                //this._data[ri][ci] = itype * this._formType + 1 ;
                this._data[ri][ci] = this.getHighligtedItemNo(this._data[ri][ci]);
                cc.log("eri:" + this._eri + ";eci:" + this._eci);
            }else{
                cc.log("invalid cell");
            }
        }
    },
    onTouchesMoved:function (touches, event) {
        cc.log("board.onTouchesMoved");
        this.rowColIndex(touches, event);
        cc.log("otm: current flow itype:" + this.getItemType(this._eri, this._eci));
        var ri, ci;
        ri = this._ri;
        ci = this._ci;

        var eri , eci;
        eri = this._eri;
        eci = this._eci;

        var dri, dci, drci;
        
        dri = Math.abs(eri-ri);
        dci = Math.abs(eci-ci);
        drci = dri + dci;
        cc.log("board.onTouchesMoved  ri:" + ri + " ;ci:" + ci + ";eri:" + eri + ";eci:" + eci + ";drci:" + drci + ";side:" + this._size);
        if(ri < this._size && ci < this._size && ri>=0 && ci>=0){
            cc.log("cell:" + this._data[ri][ci] + ";reverse cell:" + this._data[ci][ri]);
            cc.log("drci:" + drci );
            cc.log("[rici]" + this._data[ri][ci] + (this.validCellIndex(eri, eci) ?";[erieci]:" + this._data[eri][eci]:""));
            if(drci==1 ){
                cc.log("rc.itype:" + this.getItemType(ri,ci) + " comp erc.itype:" + this.getItemType(eri,eci));
                cc.log("rc.it:" + this.getItemType(ri, ci) +" != erc.it" +this.getItemType(eri, eci) 
                    + " && rc.ft:" +this.getFormType(ri, ci) + " > 1 is " 
                    + (this.getItemType(ri, ci) != this.getItemType(eri, eci) && this.getFormType(ri, ci) >1) );
                var flowCompleteFlag = this.isFlowComplete();

                cc.log("clear the old cell, eri:" + eri + ";eci:" + eci);
                if(this.getItemType(ri, ci) == this.getItemType(eri, eci) 
                    && (this.getFormType(ri, ci) >=1) && this.validCellIndex(eri, eci)){
                    if(this.getFormType(eri, eci) >1){
                        this._data[eri][eci] = this._empty;
                    }else if( this.getFormType(eri, eci) >= 0){
                        this._data[eri][eci] = this.getNormalItemNo(this._data[eri][eci]);
                        cc.log("normalitemno:" + this._data[eri][eci]);
                    }
                    this.setEndCell(ri,ci, false);
                }
                else if(!flowCompleteFlag ){
                    if( this.getItemType(ri, ci) != this.getItemType(eri, eci) && this.getFormType(ri, ci) >1){
                        cc.log("inside cross other");
                        this.clearFlowFromSelectedCell(ri, ci); 
                        //var prev ;
                        //prev = this._prevs[ri][ci];
                        //cc.log("prev:" + prev);
                        //if(this.validCellIndex(prev.x, prev.y)){
                        //    cc.log("validate prev");
                        //    this.clearFlowFromSelectedCell(prev.x, prev.y);    
                        //}
                        
                        this._data[ri][ci] = this.getJoinCommonItemNo(this._data[eri][eci]);
                        cc.log("rici]:" + this._data[ri][ci]);
                        this.setEndCell(ri,ci);
                    }
                    else if( this._data[ri][ci] == this._empty){
                        cc.log("valid move");
                        this._data[ri][ci] = Math.floor(this._data[eri][eci] / this._formType ) * this._formType + 2;
                        cc.log("[eri:"+ eri + ",eci:" + eci + "]:" + this._data[eri][eci] + ";formType:" + this._formType
                             + ";cal:" + (Math.floor(this._data[eri][eci] / this._formType ) * this._formType + 1));
                        cc.log("[ri:" + ri + ", ri:" + ci + "]:" + this._data[ri][ci]);
                        this.setEndCell(ri,ci);
                    } else if( this.getItemType(ri, ci) == this.getItemType(eri, eci)){
                        cc.log("inside else if same item type");
                        if(this.getFormType(ri, ci) <= 1){
                            cc.log("else if if same item end target");
                            this._data[ri][ci] = Math.floor(this._data[eri][eci] / this._formType ) * this._formType + 1;
                            this.setEndCell(ri,ci);
                        }
                    } 
                }
            //other item joing cell
            }else{
                cc.log("invalid move");
            }
        }else{
            cc.log("board.onTouchesMoved index cond fail");
        }
        this.printBoard();
    },
    onTouchesEnded:function (touches, event) {
        console.log("board.onTouchesEnded");
        //this._moves = this._moves + 1;
        this.rowColIndex(touches, event);
        //setting invalid value
        this._ri = -2;
        this._ci  = -2;

        this.resetEndCell();
        //this._eri = -2;
        //this._eci = -2;

    },
    onTouchesCancelled:function (touches, event) {
        console.log("board.onTouchesCancelled");
        this.rowColIndex(touches, event);
    }
});



var GamePlayLayer = cc.Layer.extend({
    _board: null,
    _circle: null,
    _isMouseDown: false,
    _levelLabel: null,
    _flowsLabel: null,
    _movesLabel: null,
    _pipeLabel: null,
    _maxFlows: 5,
    _levelNo:1,
    init:function () {
        this._super();

        this._circle =  new CircleSprite();
        this.addChild(this._circle);
        this._circle.setVisible(false);
        //r=1,g=2,b=3,y=4,o=5
        //level1 data
         var data = [   [1,0,2,0,4]
                      , [0,0,3,0,5]
                      , [0,0,0,0,0]
                      , [0,2,0,4,0]
                      , [0,1,3,5,0]
                      ];

        //level 2 data
         var l2data = [   
                [4,0,0,0,0]
              , [0,0,0,0,0]
              , [0,0,2,0,0]
              , [3,2,1,0,4]
              , [1,0,0,0,3]
              ];

        //gboard = this._board = new RectangleSprite(data, 5,250);
        // gboard = this._board = new RectangleSprite(5,250);
        // this._board.setPosition(cc.p(50,50));
        // this.addChild(this._board, 2);
        var that = this;
        gboard = that._board = new BoardSprite(data,350);
        that._board.setPosition(cc.p(50,50));
        that.addChild(that._board, 2);

        //level label
        this._levelLabel = cc.LabelTTF.create("Level " + this._levelNo, "Arial", 20);
        var size = cc.Director.getInstance().getWinSize();
        this._levelLabel.setAnchorPoint(cc.p(0.5,0.5));
        this._levelLabel.setPosition(cc.p(size.width * 0.3, size.height *.98));
        this.addChild(this._levelLabel, 5);

        //moves label
        this._movesLabel = cc.LabelTTF.create("Moves:0", "Arial", 18);
        this._movesLabel.setAnchorPoint(cc.p(0.5,0.5));
        this._movesLabel.setPosition(cc.p(size.width * 0.3, size.height *.93));
        this.addChild(this._movesLabel, 5);

        //flows Label
        this._flowsLabel = cc.LabelTTF.create("Flows:0/" + this._maxFlows, "Arial", 18);
        this._flowsLabel.setAnchorPoint(cc.p(0.5,0.5));
        this._flowsLabel.setPosition(cc.p(size.width* 0.15, size.height *.93));
        this.addChild(this._flowsLabel, 5);

        //pipe Label
        this._pipeLabel = cc.LabelTTF.create("Pipe:0%", "Arial", 18);
        this._pipeLabel.setAnchorPoint(cc.p(0.5,0.5));
        this._pipeLabel.setPosition(cc.p(size.width* 0.45, size.height *.93));
        this.addChild(this._pipeLabel, 5);

        //restart button
        var restartItem = cc.MenuItemImage.create(
            "res/CloseNormal.png",
            "res/CloseSelected.png",
            this.restartGame
            ,this);
        restartItem.setAnchorPoint(cc.p(0.5, 0.5));

        var menu = cc.Menu.create(restartItem);
        menu.setPosition(cc.PointZero());
        this.addChild(menu, 1);
        restartItem.setPosition(cc.p(size.width * .3, size.height * 0.05));

        cc.log("set touch enable in hello layer");
        this.setTouchEnabled(true);
        return true;
    },
    onEnter: function() {
        /*
        cc.log("onEnter");
        var that = this;
        var xhr = new XMLHttpRequest();
        var url = "http://localhost:8888/Cocos2d-html5-v2.2/magic_flow_level/level"+this._levelNo+".json";
        cc.log("hitting url:" +url);
        xhr.open("GET", url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState==4 && xhr.status==200) {
                var httpStatus = xhr.statusText;
                var response = xhr.responseText;
                var respObj = eval('(' + response + ')');
                gboard = that._board = new BoardSprite(respObj,350);
                that._board.setPosition(cc.p(50,50));
                that.addChild(that._board, 2);
            }
        };
        xhr.send();
        */
    },

    onTouchesBegan:function (touches, event) {
        cc.log("inside ontouches begain of GamePlayLayer layer");
        if(!this._board || this._board == null || typeof(this._board) === 'undefined'){
            cc.log("no board set");
            return;
        }
        this._board.onTouchesBegan(touches, event);
        this._isMouseDown = true;
        if(touches){
             //cc.log("down tx:" + touches[0].getLocation().x + ";ty:" + touches[0].getLocation().y);
        }
        this.updateFlows(this._board.getCompletedFlows());
        this.updateMoves(this._board._moves);
    },
    onTouchesMoved:function (touches, event) {
        cc.log("inside ontouches moved of GamePlayLayer layer");
        if(!this._board || this._board == null || typeof(this._board) === 'undefined'){
            cc.log("no board set");
            return;
        }
        this._board.onTouchesMoved(touches, event);
        
        if(this._isMouseDown){
            if (touches) {
                this._circle.setPosition(cc.p(touches[0].getLocation().x, touches[0].getLocation().y));
                this._circle.setVisible(true);
                //cc.log("move tx:" + touches[0].getLocation().x + ";ty:" + touches[0].getLocation().y);
            }
            this.updatePipe(this._board.getPipePercentage());
            this.updateFlows(this._board.getCompletedFlows());
        }
    },
    onTouchesEnded:function (touches, event) {
        cc.log("inside ontouches ended of GamePlayLayer layer");
        if(!this._board || this._board == null || typeof(this._board) === 'undefined'){
            cc.log("no board set");
            return;
        }
        if(!touches ){
            return ;
        }
        this._board.onTouchesEnded(touches, event);
        
        this._circle.setVisible(false);
        this._isMouseDown = false;
        console.log("flows:" + this._board._flows + ";moves:" + this._board._moves);
        this.updateFlows(this._board.getCompletedFlows());
    },
    onTouchesCancelled:function (touches, event) {
        console.log("onTouchesCancelled");
    }, updateMoves:function(moves){
        this._movesLabel.setString("Moves:" + moves);
    }, updateFlows: function(flows){
        this._flowsLabel.setString("Flows:" + flows + "/" + this._maxFlows);
    }, updatePipe: function(pipe){
        //cc.log("pip is:" + pipe);
        this._pipeLabel.setString("Pipe:" + (100-pipe) + "%");
    }, restartGame: function(sender){
        cc.log("restart game");
        return false;
    }
});


var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GamePlayLayer();
        //var layer = new LevelLayer();
        layer.init();
        this.addChild(layer);
    }
});

