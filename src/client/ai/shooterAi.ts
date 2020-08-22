import { BaseAi } from './baseAi';
import Point from '_src/utils/point';
import Event from '_src/utils/event';

export interface ShooterAiOption {

}

export enum AiOprationEvent {
    ChangeSpeed = 'cs',
    Fire = 'f',
    EndFire ='ef'
}

const SPEED_BASE = 0.003;

export class ShooterAi extends  BaseAi{
    private _attackToleranceDistance = 400;
    private _searchToleranceDistance = 600;
    private _attackMaxDistance = 200;
    private _direction: Point;
    private _deltaSpeed: Point;
    private _waitVector: Point;
    constructor(opt: ShooterAiOption) {
        super();
    }

    public update() {
        const distance = this._myObj.loc.clone().sub(this._targetObj.loc).mag();
        if (distance >= 600) {
            this._startWait();
        } else if (distance >= 400) {
            this._startSearch();
        } else {
            this._startAttack(distance);
        }
    }

    private _startSearch() {
        this.emit(new Event(AiOprationEvent.EndFire));
        const vector = this._targetObj.loc.clone().sub(this._myObj.loc);
        this.emit(new Event(AiOprationEvent.ChangeSpeed, vector.unit().mult(SPEED_BASE)));
    }

    private _startWait() {
        this.emit(new Event(AiOprationEvent.EndFire));
        this._randomMove();
    }

    private _randomMove() {
        if (this._waitVector) {
            this.emit(new Event(AiOprationEvent.ChangeSpeed, this._waitVector));
            return;
        }
        this._waitVector = new Point(Math.random() - 0.5, Math.random() - 0.5, 0).unit().mult(SPEED_BASE);
        setTimeout(() => {
            this._waitVector = null;
        }, 2000);
    }

    private _startAttack(distance: number) {
        const vector = this._targetObj.loc.clone().sub(this._myObj.loc);
        if (distance >= 200) {
            this._randomMove();
        } else {
            this.emit(new Event(AiOprationEvent.ChangeSpeed, vector.clone().unit().reverse().mult(SPEED_BASE)));
        }
        this.emit(new Event(AiOprationEvent.Fire, vector));
    }
}