import { _decorator, Component, Node, Graphics, Vec3, UITransform, v3, Color, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DrawCountDown')
export class DrawCountDown extends Component {

    @property(Graphics)
    graphics: Graphics = null;

    _vertex: Vec3[] = [];
    _perimeter = 0;
    _points: Vec3[] = [];

    start() {
        let gr_pos = this.graphics.node.position;
        let ui = this.graphics.getComponent(UITransform);
        let gr_w = ui.width / 2;
        let gr_h = ui.height / 2;
        this._perimeter = (ui.width + ui.height) * 2

        let ver1 = v3(gr_pos.x + gr_w, gr_pos.y + gr_h, 1);
        let ver2 = v3(gr_pos.x + gr_w, gr_pos.y - gr_h, 1);
        let ver3 = v3(gr_pos.x - gr_w, gr_pos.y - gr_h, 1);
        let ver4 = v3(gr_pos.x - gr_w, gr_pos.y + gr_h, 1);
        this._vertex = [ver1, ver2, ver3, ver4, ver1];
        let c = this._perimeter / 1;
        // for (let i = 0; i < c; i++) {
        //     let x = gr_w
        //     let y = 
        // } 

        this.drawGR();
    }

    drawGR(){
        this.graphics.clear()
        let first = this._vertex.shift()
        this.graphics.moveTo(first.x, first.y);
        // this._vertex.forEach(v => {
        //     this.graphics.lineTo(v.x, v.y);
        // });
        this.graphics.strokeColor = Color.GREEN;
        // this.graphics.stroke();
    }

    startCountDown(startTime: number, endTime: number, duration: number) {
        if (startTime >= endTime) {
            return;
        }
        let byStartWithZero = (startTime + duration === endTime) ? true : false;
        let now = startTime;
        let cur_step = byStartWithZero ? 0 : endTime - startTime;
        let all_step = duration;
        let cur_step_temp = cur_step;

        let tw = tween(this.node);

        let callback = () => {
            cur_step = byStartWithZero ? Date.now() - now : (cur_step_temp + Date.now() - now);
            if (cur_step > all_step) {
                tw.stop();
                return;
            }
            let step_fillrange = cur_step / all_step;
            this.showCD(step_fillrange);
        }

        tw.sequence(
            tween().delay(0.001),
            tween().call(callback)
        )
            .repeatForever()
            .start();

    }

    showCD(range: number){
        let W = this.graphics.getComponent(UITransform).width / 2;
        let H = this.graphics.getComponent(UITransform).height / 2;
        let A = Math.atan(H / W);

        let x = 0, y = 0;
        let PI = Math.PI;
        let cur_fill = range;
        // let cur_fill = this.cdSprite.fillRange + 0.25;
        let a = PI * 2 * cur_fill;
        // if (PI * 2 - A <= a || a <= A) {
        //     x = W
        //     y = -W * Math.tan(a)
        // }
        // else if (A < a && a < PI - A) {
        //     x = H / Math.tan(a)
        //     y = -H
        // }
        // else if (PI - A <= a && a <= PI + A) {
        //     x = -W
        //     y = W * Math.tan(a)
        // }
        // else if (PI + A < a && a < PI * 2 - A) {
        //     x = -H / Math.tan(a)
        //     y = H
        // }
        x = Math.sin(a) * W;
        y = Math.cos(a) * W;
        // this.particle2D.node.setPosition(v3(x, -y, 100));
        this.graphics.lineTo(x, -y);
        this.graphics.stroke();
    }

    update(deltaTime: number) {
        
    }

    onClickStart() {
        // this.graphics.clear();
        let s = Date.now();
        let e = s + 10 * 1000;
        let d = 10 * 1000
        this.startCountDown(s, e, d);
    }
}

