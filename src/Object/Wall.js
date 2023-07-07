import { Color, Entity, StandardMaterial, Vec3 } from "playcanvas";
import { GameConstant } from "../GameConstant";
import { AssetsLoader } from "../assets/AssetsLoader";


export class Wall extends Entity {
    constructor(pos = new Vec3, size = new Vec2) {
        super()

        this.type = 1


        this.material = new StandardMaterial();
        this.material.diffuse = GameConstant.DEFAULT_COLOR_WALL
        this.material.update()
        // this.modelAsset = AssetsLoader.getAssetByKey("box")
        this.addComponent("model", { type: "box", material: this.material });
        this.setLocalPosition(pos)
        this.setLocalScale(size.x, GameConstant.DEFAULT_HEIGHT_WALL, size.y)
    }
}