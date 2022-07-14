import { _decorator, Component, Node, Material, Sprite, UITransform, v2, math, EventTouch, Vec2, v3, Rect } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TurnCard')
export class TurnCard extends Component {
    @property(Node)
    touchLayer: Node = null;

    @property(Node)
    cardBg: Node = null;

    @property(Node)
    cardNum: Node = null;

    _bgMtl: Material = null;
    _numMtl: Material = null;

    initBox: math.Rect;
    box: math.Rect;

    upPos: Vec2;
    initPos: Vec2;
    movePos: Vec2;

    start() {
        this._bgMtl = this.cardBg.getComponent(Sprite).getMaterial(0);
        this._numMtl = this.cardNum.getComponent(Sprite).getMaterial(0);
        // console.log(this._bgMtl, this._numMtl);

        this.initBox = this.cardBg.getComponent(UITransform).getBoundingBoxToWorld();
        this.box = this.cardNum.getComponent(UITransform).getBoundingBoxToWorld();

        this._numMtl.setProperty('worldPos', v2(this.box.x, this.box.y));
        this._numMtl.setProperty('sprWidth', this.box.width);
        this._numMtl.setProperty('sprHight', this.box.height);

        this._bgMtl.setProperty('sprWidth', this.box.width);
        this._bgMtl.setProperty('sprHight', this.box.height);

        this.touchLayer.on(Node.EventType.TOUCH_START, (e: EventTouch) => {
            // console.log('touch start');
            this.upPos = e.getUILocation();
        }, this);

        this.touchLayer.on(Node.EventType.TOUCH_MOVE, (e: EventTouch) => {
            let pos = e.getUILocation();
            let disRect = v2(this.upPos.x - this.box.x, this.upPos.y - this.box.y);
            if (this.initPos) {
                this.movePos = v2(pos.x - this.box.x, pos.y - this.box.y);
                this.setXY();
            } else {
                let ds = 30;
                let box = new Rect(this.box.x, this.box.y, this.box.width, this.box.height);
                box.x += ds;
                box.y += ds;
                box.width -= ds*2;
                box.height -= ds*2;
                if (this.box.contains(pos) && !box.contains(this.upPos)) {
                    if (disRect.x <= ds) {
                        disRect.x = 0;
                    }else if (disRect.x >= this.box.width - ds) {
                        disRect.x = this.box.width;
                    }
                    if (disRect.y <= ds) {
                        disRect.y = 0;
                    }else if (disRect.y >= this.box.height - ds) {
                        disRect.y = this.box.height;
                    }
                    this.initPos = disRect;
                }
            }
            this.upPos = pos;
        }, this)

        this.touchLayer.on(Node.EventType.TOUCH_END, (e: EventTouch) => {
            // e.propagationStopped = false;
            this.initData();
            this.initPos = null;
        }, this)

        this.touchLayer.on(Node.EventType.TOUCH_CANCEL, (e: EventTouch) => {
            // e.propagationStopped = false;
            this.initData();
            this.initPos = null;
        }, this)

        this.initData();
    }

    initData(){
        this._bgMtl.setProperty('disX', v2(0.0, 0.0));
        this._bgMtl.setProperty('disY', v2(0.0, 0.0));
        this._bgMtl.setProperty('xlist', v3(0.0, 0.0, 0.0));
        this._bgMtl.setProperty('ylist', v3(0.0, 0.0, 0.0));

        this._numMtl.setProperty('disX', v2(0.0, 0.0));
        this._numMtl.setProperty('disY', v2(0.0, 0.0));
        this._numMtl.setProperty('xlist', v3(0.0, 0.0, 0.0));
        this._numMtl.setProperty('ylist', v3(0.0, 0.0, 0.0));
        this._numMtl.setProperty('worldSprWidth', this.box.width);
        this._numMtl.setProperty('worldSprHeight', this.box.height);
        this._numMtl.setProperty('disXSymmetricPos', v2(0.0, 0.0));
        this._numMtl.setProperty('disYSymmetricPos', v2(0.0, 0.0));
        this._numMtl.setProperty('xlistSymmetricPos', v3(0.0, 0.0, 0.0));
        this._numMtl.setProperty('ylistSymmetricPos', v3(0.0, 0.0, 0.0));
    }

    getXYData(initPos: Vec2, movePos: Vec2, width: number, height: number){
        let XYData = {
            disX: v2(0, 0), disY: v2(0, 0), xlist: v3(0, 0, 0), ylist: v3(0, 0, 0)
        };
        let disX = movePos.x - initPos.x;
        let disY = movePos.y - initPos.y;
        if (disY == 0) {
            var x1 = 0;
            var x2 = (initPos.x * 2 + disX) * 0.5;
            if (disX < 0) {
                x1 = (width - ((width - initPos.x) * 2 - disX) * 0.5);
                x2 = width;
            }
            XYData.disX = v2(x1, x2);
        } else if (disX == 0) {
            var y1 = height - (initPos.y * 2 + disY) * 0.5;
            var y2 = height;
            if (disY < 0) {
                y1 = 0;
                y2 = ((height - initPos.y) * 2 - disY) * 0.5;
            }
            XYData.disY = v2(y1, y2);

        } else {
            //获取反正切值
            var tanValue = Math.atan(disY / disX);
            //获取斜边距离
            var disHy = Math.sqrt(disX * disX + disY * disY);
            //log(">>>>>>>disHy:",disHy)
            //获取隐藏部分的y
            var hy = Math.abs((disHy * 0.5) / Math.sin(tanValue));
            //获取隐藏部分的x
            var hx = Math.abs((disHy * 0.5) / Math.cos(tanValue));

            var pos1 = v2(0, 0);
            var pos2 = v2(0, 0);
            var pos3 = v2(0, 0);
            if (disX > 0 && disY > 0) {          //往右上翻牌
                pos1.x = 0;
                pos1.y = height;
                if (initPos.x > initPos.y) {
                    pos2.x = hx + initPos.x;
                    pos2.y = height;
                    pos3.x = 0;
                    pos3.y = height - (((hx + initPos.x) / hx * (hy + initPos.y)));
                    //log(">>>>>>>>>>>>>>往右上翻牌1")
                } else {
                    pos2.x = 0;
                    pos2.y = height - (hy + initPos.y);
                    pos3.x = (hy + initPos.y) / hy * (hx + initPos.x);
                    pos3.y = height;
                    //log(">>>>>>>>>>>>>>往右上翻牌2")
                }
            } else if (disX < 0 && disY > 0) {    //往左上翻牌
                pos1.x = width;
                pos1.y = height;
                if (width - initPos.x > initPos.y) {
                    pos2.x = width - (hx + width - initPos.x);
                    pos2.y = height;
                    pos3.x = width;
                    pos3.y = height - ((width - pos2.x) / hx * (hy + initPos.y));
                    //log(">>>>>>>>>>>>>>往左上翻牌1")
                } else {
                    pos2.x = width;
                    pos2.y = height - (hy + initPos.y);
                    pos3.x = width - (hy + initPos.y) / hy * (hx + width - initPos.x);
                    pos3.y = height;
                    //log(">>>>>>>>>>>>>>往左上翻牌2")
                }

            } else if (disX > 0 && disY < 0) {    //往右下翻牌
                pos1.x = 0;
                pos1.y = 0;
                if (initPos.x > height - initPos.y) {
                    pos2.x = hx + initPos.x;
                    pos2.y = 0;
                    pos3.x = 0;
                    pos3.y = pos2.x / hx * (hy + height - initPos.y);
                    //log(">>>>>>>>>>>>>>往右下翻牌1")
                } else {
                    pos2.x = 0;
                    pos2.y = hy + (height - initPos.y);
                    pos3.x = (hy + (height - initPos.y)) / hy * hx + initPos.x;
                    pos3.y = 0;
                    //log(">>>>>>>>>>>>>>往右下翻牌2")
                }

            } else if (disX < 0 && disY < 0) {    //往左下翻牌
                pos1.x = width;
                pos1.y = 0;
                if (width - initPos.x > height - initPos.y) {
                    pos2.x = width - (hx + width - initPos.x);
                    pos2.y = 0;
                    pos3.x = width;
                    pos3.y = (width - pos2.x) / hx * (hy + height - initPos.y);
                    //log(">>>>>>>>>>>>>>往左下翻牌1")
                } else {
                    pos2.x = width;
                    pos2.y = hy + (height - initPos.y);
                    pos3.x = width - (hy + (height - initPos.y)) / hy * (hx + width - initPos.x);
                    pos3.y = 0;
                    //log(">>>>>>>>>>>>>>往左下翻牌2")
                }

            }

            var xlist = v3(pos1.x, pos2.x, pos3.x);
            var ylist = v3(pos1.y, pos2.y, pos3.y);

            XYData.xlist = xlist
            XYData.ylist = ylist
        }

        return XYData;
    }

    setXY(){
        let _initPos = this.initPos;
        let _movePos = this.movePos;

        if (this.cardBg.angle == -90) {
            _initPos.x = this.box.height - this.initPos.y;
            _initPos.y = this.initBox.x
            _movePos.x = this.box.height - this.movePos.y;
            _movePos.y = this.movePos.x;
        }else if (this.cardBg.angle == -180) {
            _initPos.x = this.box.width - this.initPos.x;
            _initPos.y = this.box.height - this.initPos.y;
            _movePos.x = this.box.width - this.movePos.x;
            _movePos.y = this.box.height - this.movePos.y;
        }else if (this.cardBg.angle == -270) {
            _initPos.x = this.initPos.y;
            _initPos.y = this.box.width - this.initPos.x;
            _movePos.x = this.movePos.y;
            _movePos.y = this.box.width - this.movePos.x;
        }

        let xyData = this.getXYData(_initPos, _movePos, this.initBox.width, this.initBox.height);

        this._bgMtl.setProperty('disX', xyData.disX);
        this._bgMtl.setProperty('disY', xyData.disY);
        this._bgMtl.setProperty('xlist', xyData.xlist);
        this._bgMtl.setProperty('ylist', xyData.ylist);

        this._numMtl.setProperty('disX', xyData.disX);
        this._numMtl.setProperty('disY', xyData.disY);
        this._numMtl.setProperty('xlist', xyData.xlist);
        this._numMtl.setProperty('ylist', xyData.ylist);

        xyData = this.getXYData(this.initPos, this.movePos, this.box.width, this.box.height);

        this._numMtl.setProperty('disXSymmetricPos', xyData.disX);
        this._numMtl.setProperty('disYSymmetricPos', xyData.disY);
        this._numMtl.setProperty('xlistSymmetricPos', xyData.xlist);
        this._numMtl.setProperty('ylistSymmetricPos', xyData.ylist);
    }

    
}

