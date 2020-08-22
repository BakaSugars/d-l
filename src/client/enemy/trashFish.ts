import { EnemyBase, EnemyBaseOption, getEnemyUid } from "_src/client/enemy/enemyBase";
import Point from "_src/utils/point";
import Shooter from "_src/client/elements/shooter";
import { ShooterAi, AiOprationEvent } from "_src/client/ai/shooterAi";
import Event from "_src/utils/event";

export class TrashFish extends EnemyBase {
    private _maxFirePerSec = 1;
    private _bulletColor = [255, 99, 71, 255];
    private _bulletSize = 8;
    private _camp = 1;
    private _bulletSpeed = 0.06;
    private _selfColor = [255, 250, 205, 255];
    protected _me: Shooter;
    private _onFire = false;
    constructor(option: EnemyBaseOption) {
        super(option);
    }

    public createTrashFish(loc: Point) {
        this._me = new Shooter({
            loc,
            uid: getEnemyUid(),
            camp: this._camp
        });
        this._me.maxFirePerSec = this._maxFirePerSec;
        this._me.bulletColor = this._bulletColor;
        this._me.bulletSize = this._bulletSize;
        this._me.bulletSpeed = this._bulletSpeed;
        this._me.color = this._selfColor;
        this._initAi();
        return this._me;
    }
    
    public get trashFish() {
        return this._me;
    }

    private _initAi() {
        this._ai = new ShooterAi({});
        this._ai.myObj = this._me;
        this._ai.targetObj = this._hateElement;
        this._initEvent();
    }

    private _initEvent() {
        this._ai.on(AiOprationEvent.ChangeSpeed, (e: Event) => {
            this._me.speed.add(e.data);
        });
        this._ai.on(AiOprationEvent.Fire, (e: Event) => {
            this._me.direction = e.data.unit();
            if (this._onFire) {
                return;
            }
            this._onFire = this._me.startFire();
        });
        this._ai.on(AiOprationEvent.EndFire, () => {
            this._onFire = false;
            this._me.endFire();
        });
    }

}