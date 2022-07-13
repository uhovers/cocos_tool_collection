import { _decorator, Component, Node, game, Game, tween, v3, Vec3, Tween } from 'cc';
const { ccclass, property } = _decorator;

let timeScale = 1;

//game._calculateDT 控制镜头速度，实现慢镜头效果
//@ts-ignore
game._calculateDT = function (now: number) {
    if (!now) {
        now = performance.now();
    }
    this._deltaTime = now > this._startTime ? (now - this._startTime)/1000 : 0;
    if (this._deltaTime > Game.DEBUG_DT_THRESHOLD) {
        this._deltaTime = this._frameTime / 1000;
    }
    this._startTime = now;
    return this._deltaTime * timeScale;
}

@ccclass('GameTimeScale')
export class GameTimeScale extends Component {
    @property(Node)
    sp: Node = undefined;

    start() {

        tween(this.sp)
         .to(1.5, {position: v3(-200, 0, 1)})
         .to(1.5, {position: v3(200, 0, 1)})
         .union()
         .repeatForever()
         .start()

        this.schedule(() => {
            timeScale = timeScale===1 ? 0.1 : 1
        }, 3)

    }

    update(deltaTime: number) {
        
    }
}

