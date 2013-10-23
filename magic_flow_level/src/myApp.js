/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var LevelCellSprite = cc.Sprite.extend({
    _levelNo:1,
    _size:100,
    _cr:255,
    _cg:0,
    _cb:0,
    _co:255,
    ctor:function (size, cr, cg, cb, co) {
        this._super();
        if(size){
            this._size = size;
        }
        if(cr){
            this._cr = cr;
        }
        if(cg){
            this._cg = cg;
        }
        if(cb){
            this._cb = cb;
        }
        if(co){
            this._co = co;
        }
        cc.log("size:" + this._size);
        //level label
        var lbl = cc.LabelTTF.create(this._levelNo, "Arial", 18);
        lbl.setAnchorPoint(cc.p(0.5,0.5));
        lbl.setPosition(cc.p(this._size/2, this._size/2));
        this.addChild(lbl, 5);
        this._lbl = lbl;
    },
    draw:function () {
        cc.drawingUtil.setDrawColor4B(this._cr,this._cg,this._cb,this._co);
        cc.drawingUtil.setLineWidth(2);

        cc.drawingUtil.drawRect(cc.p(0,0), cc.p(this._size , this._size));
    }
});

var LevelGroupLayer = cc.Layer.extend({
    init: function(){
        this._super();
        cc.log("inside LevelGroupLayer init");
        var size = cc.Director.getInstance().getWinSize();
        this.lcl = new LevelCellSprite();
        this.lcl.setAnchorPoint(cc.p(0.5,0.5));
        this.lcl.setPosition(cc.p(size.width/2, size.height/2));
        this.addChild(this.lcl, 2);

    }
});

var Helloworld = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,

    init:function () {
        var selfPointer = this;
        //////////////////////////////
        // 1. super init first
        this._super();
        // var size = cc.Director.getInstance().getWinSize();
        // this.lcl = new LevelCellSprite();
        // this.lcl.setAnchorPoint(cc.p(0.5,0.5));
        // this.lcl.setPosition(cc.p(size.width/2, size.height/2));
        // this.addChild(this.lcl, 2);

        var size = cc.Director.getInstance().getWinSize();
        this.lg = new LevelGroupLayer();
        this.lg.setAnchorPoint(cc.p(0.5,0.5));
        this.lg.setPosition(cc.p(size.width/2, size.height/2));
        this.addChild(this.lg, 2);


        this.setTouchEnabled(true);

        cc.log("creating xhr");
        var xhr = new XMLHttpRequest();
        //xhr.open("GET", "http://httpbin.org/get");
        xhr.open("GET", "http://localhost:8888/Cocos2d-html5-v2.2/magic_flow_level/test.json");
        xhr.open("GET", "http://localhost:8888/Cocos2d-html5-v2.2/magic_flow_level/level_data.json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState==4 && xhr.status==200) {
                var httpStatus = xhr.statusText;
                var response = xhr.responseText;
                //cc.log("response:" + response);
                //var respObj = eval(response);
                var respObj = eval('(' + response + ')');
                cc.log("response:" + response);
                //cc.log("respObj:" + respObj.name);
                cc.log("respObj:" + respObj);
            //return true;
            }
        };
        xhr.send();
    },
    // a selector callback
    menuCloseCallback:function (sender) {
        cc.Director.getInstance().end();
    },
    onTouchesBegan:function (touches, event) {
        this.isMouseDown = true;
    },
    onTouchesMoved:function (touches, event) {
        if (this.isMouseDown) {
            if (touches) {
            }
        }
    },
    onTouchesEnded:function (touches, event) {
        this.isMouseDown = false;
    },
    onTouchesCancelled:function (touches, event) {
        console.log("onTouchesCancelled");
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Helloworld();
        layer.init();
        this.addChild(layer);
    }
});

