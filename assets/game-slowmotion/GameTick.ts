import { _decorator, Component, Node, director, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

//director.tick 实现游戏慢镜头

@ccclass('GameTick')
export class GameTick extends Component {

    @property(Node)
    sp: Node = undefined;

    speedFlag = true;

    oldTick = director.tick;

    start() {
        director.tick = (dt: number) => {
            this.oldTick.call(director, dt * (this.speedFlag ? 1 : 0.1))
        };

        tween(this.sp)
         .to(1.5, {position: v3(-200, 0, 1)})
         .to(1.5, {position: v3(200, 0, 1)})
         .union()
         .repeatForever()
         .start()

        this.schedule(() => {
            this.speedFlag = !this.speedFlag;
        }, 3)
    }

    update(deltaTime: number) {
        
    }

    onDestroy(){
        director.tick = this.oldTick;
    }
}

