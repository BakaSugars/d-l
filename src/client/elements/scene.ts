import { DataBucket } from "_src/client/render/dataBucket";
import Grid from "_src/client/elements/grid";
import Shooter from "_src/client/elements/shooter";
import Bullet from "_src/client/elements/bullet";
import { Player } from "_src/client/elements/player";
import Point from "_src/utils/point";
import ShooterLayer from "_src/client/layers/shooterLayers";
import Camera from "_src/client/view/camera";
import mat4 from "_src/utils/mat4";
import Renderer from "_src/client/render/renderer";
import { Border } from "_src/client/elements/border";
import { GridLayer } from "_src/client/layers/gridLayers";
import Coordinate from "_src/utils/coordinate";
import BulletLayer from "_src/client/layers/bulletLayer";
import { CollsionManager } from "_src/client/elements/collsionManager";
import { TrashFish } from "_src/client/enemy/trashFish";
import { Element } from "_src/client/elements/element";
import { SkyBoxLayer } from "_src/client/layers/skyBoxLayer";

export class Scene {
    private _width: number;
    private _height: number;
    private _dataBucket: DataBucket;
    private _gridLayer: GridLayer;
    private _shooterLayer: ShooterLayer;
    private _bulletLayer: BulletLayer;
    private _skyBoxLayer: SkyBoxLayer;
    private _camera: Camera;
    private _border: Border;
    private _collisonManager: CollsionManager;
    private _gridSize = 50;
    private _trashFishs: TrashFish[] = [];
    constructor(width: number, height: number, renderer: Renderer) {
        this._width = width;
        this._height = height;
        this._dataBucket = new DataBucket();
        this._shooterLayer = new ShooterLayer(renderer);
        this._bulletLayer = new BulletLayer(renderer);
        this._gridLayer = new GridLayer(renderer);
        this._skyBoxLayer = new SkyBoxLayer(renderer);
        this._border = new Border(width, height, this._gridSize);
        this._collisonManager = new CollsionManager();
        this._initGrids();
    }

    public update() {
        this._trashFishs.forEach((trashFish: TrashFish) => {
            trashFish.update();
        });
        this._shooterLayer.shooters.forEach((shooter: Shooter) => {
            if (shooter.destroyed) {
                return;
            }
            shooter.update();
        });
    }

    public globalCollsion() {
        this._collisonManager.clear();
        this._border.addCollsionUnit(this._collisonManager);
        this._shooterLayer.shooters.forEach((shooter: Shooter) => {
            if (shooter.destroyed) {
                return;
            }
            shooter.addCollsionUnit(this._collisonManager);
        });
    }

    public joinPlayer(p: Player) {
        const shooter = p.createShooter(new Point(0, 0, 0));
        this._shooterLayer.addShooter(shooter);
        this._bulletLayer.addBulletManager(shooter);
        this._initEnemy(shooter);
    }

    public setView(p: Player) {
        this._camera = p.camera;
        p.fitCamera();
    }

    public draw() {
        this.update();
        this.globalCollsion();
        this._skyBoxLayer.draw();
        this._gridLayer.draw(this._camera.mvpMatrix);
        this._shooterLayer.draw(this._camera.mvpMatrix);
        this._bulletLayer.draw(this._camera.mvpMatrix);
    }

    private _initEnemy(hate: Element) {
        for(let i = 0; i < 20; i++) {
            const trashFish = new TrashFish({
                hate
            });
            const random = new Point(Math.random() - 0.5, Math.random() - 0.5, 0);
            const shooter = trashFish.createTrashFish(random.mult(1500));
            this._shooterLayer.addShooter(shooter);
            this._bulletLayer.addBulletManager(shooter);
            this._trashFishs.push(trashFish);
        }
    }

    private _initGrids() {
        for (let i = 0; i < this._width; i ++) {
            for (let j = 0; j < this._height; j ++) {
                const col = i - Math.floor(this._width / 2);
                const row = j - Math.floor(this._height / 2);
                // const color = [Math.random() * 255, Math.random() * 255, Math.random() * 255, 255];
                const color = [0, 0, 0, 100];
                const grid = new Grid(new Coordinate(col, row, 0), this._gridSize, color);
                this._gridLayer.addGrid(grid);
            }
        }
    }
}