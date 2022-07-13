import { _decorator, Component, Node, Button, director, assetManager } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Lobby')
export class Lobby extends Component {
    @property(Button)
    btn: Button = undefined;

    start() {
        assetManager.loadBundle('game1')
        assetManager.loadBundle('game2')

    }

    update(deltaTime: number) {
        
    }

    onClickGame1(){
        director.loadScene('g1');
    }

    onClickGame2(){
        director.loadScene('g2');
    }
}

