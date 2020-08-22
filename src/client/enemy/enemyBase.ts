import Shooter, { ShooterOption } from "_src/client/elements/shooter";
import { Element } from "_src/client/elements/element";
import { BaseAi } from "_src/client/ai/baseAi";

let id = 0;

export function getEnemyUid() {
    const uid = 'Enemy_' + id;
    id ++;
    return uid;
}

export interface EnemyBaseOption {
    hate: Element;
}

export abstract class EnemyBase {
    protected _hateElement: Element;
    protected _ai: BaseAi;
    protected _me: Element;
    constructor(opt: EnemyBaseOption) {
        this._hateElement = opt.hate;
    }
    
    public update() {
        this._ai.update();
    }

    public destroy() {
        this._ai.destroy();
        this._me.destroy();
    }
}