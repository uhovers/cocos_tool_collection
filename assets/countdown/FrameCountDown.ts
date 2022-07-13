import { _decorator, Component, Node, Sprite, color, tween, Color, ParticleSystem2D, UITransform, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FrameCountDown')
export class FrameCountDown extends Component {

    @property(Sprite)
    cdSprite: Sprite = null;

    particle2D: ParticleSystem2D = null;

    start() {
        this.particle2D = this.node.getChildByName('Particle2D').getComponent(ParticleSystem2D);

        this.initCountDown();
    }

    initCountDown(range = 1){
        this.cdSprite.fillStart = 0;
        this.cdSprite.fillRange = range;
        this.cdSprite.color = color(0, 255, 0, 255);
    }

    startCountDown(startTime: number, endTime: number, duration: number){
        if (startTime>=endTime) {
            return;
        }
        let byStartWithZero = (startTime + duration === endTime) ? true : false;
        let now = startTime;
        let cur_step = byStartWithZero ? 0 : endTime - startTime;
        let all_step = duration;
        let cur_step_temp = cur_step;

        this.initCountDown(1 - (cur_step / all_step));
        let tw = tween(this.cdSprite);

        let callback = () => {
            cur_step = byStartWithZero ? Date.now() - now : (cur_step_temp + Date.now() - now);
            if (cur_step > all_step) {
                tw.stop();
                this.cdSprite.fillRange = 0;
                this.particle2D.stopSystem();
                this.particle2D.node.active = false;
                return;
            }
            let step_fillrange = cur_step / all_step;
            this.cdSprite.fillRange = 1 - step_fillrange;
            let c = this.getColorByRange(step_fillrange);
            this.cdSprite.color = c;
            this.updateParticle2D(c);
        }

        tw.sequence(
            tween().delay(0.001),
            tween().call(callback)
        )
        .repeatForever()
        .start();

    }

    getColorByRange(range: number){
        let c = Color.GRAY;
        // if (range < 0.33) {
        //     c = Color.GREEN;
        // } else if (range < 0.66) {
        //     c = Color.YELLOW;
        // }else {
        //     c = Color.RED;
        // }
        return c;
    }

    updateParticle2D(c: Color){
        this.particle2D.endColor = color(c.r, c.g, c.b, 255)
        if (this.particle2D.stopped) {
            this.particle2D.node.active = true;
            this.particle2D.resetSystem();
        }
        let W = this.node.getComponent(UITransform).width / 2;
        let H = this.node.getComponent(UITransform).height / 2;
        let A = Math.atan(H / W);

        let x = 0, y = 0;
        let PI = Math.PI;
        let cur_fill = this.cdSprite.fillRange;
        // let cur_fill = this.cdSprite.fillRange + 0.25;
        let a = PI * 2 * cur_fill;
        if (PI * 2 - A <= a || a <= A) {
            x = W
            y = -W * Math.tan(a)
        }
        else if (A < a && a < PI - A) {
            x = H / Math.tan(a)
            y = -H
        }
        else if (PI - A <= a && a <= PI + A) {
            x = -W
            y = W * Math.tan(a)
        }
        else if (PI + A < a && a < PI * 2 - A) {
            x = -H / Math.tan(a)
            y = H
        }
        // x = Math.sin(a) * W;
        // y = Math.cos(a) * W;
        this.particle2D.node.setPosition(v3(x, -y, 100));
    }

    update(deltaTime: number) {
        
    }

    onClickStart() {
        let s = Date.now();
        let e = s + 10 * 1000;
        let d = 10 * 1000
        this.startCountDown(s, e, d);
    }
}

