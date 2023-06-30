import { Entity, Vec3, StandardMaterial } from "playcanvas";
import { Snake } from "./Snake";
import { Helper } from "../Helper/Helper";
import { AssetsLoader } from "../assets/AssetsLoader";
import { Queue } from "../Helper/Queue";


export class Box extends Entity {
    constructor(name = null, number = 2) {
        super(name);
        this.number = number;
        this.nextBox = null;
        this.speed = 2;
        this.run = true
        this.queue = new Queue()


        // create material
        this.material = new StandardMaterial();
        this.material.diffuse = Helper.getColorByNumber(this.number);
        this.material.update()

        this.modelAsset = AssetsLoader.getAssetByKey("box")
        this.boxModel = new Entity()
        this.boxModel.addComponent("model", { asset: this.modelAsset });
        this.boxModel.model.meshInstances[0].material = this.material
        this.boxModel.setLocalPosition(0, 0, 0)
        this.boxModel.setLocalEulerAngles(0, 0, 0)
        var scale = Helper.getScaleByNumber(this.number)
        this.boxModel.setLocalScale(scale, scale, scale)
        this.addChild(this.boxModel);


        // text number
        AssetsLoader.createCanvasFont("Arial", 106, "bold");
        this.textEntity = new Entity();
        this.textEntity.addComponent("element", {
            type: "text",
            text: Helper.getStringByNumber(this.number),
            fontAsset: AssetsLoader.getAssetByKey("CanvasFont"),
            fontSize: 32,
            pivot: new pc.Vec2(0.5, 0.5), // Đặt pivot ở vị trí trung tâm của Text Element
            width: 200, // Điều chỉnh kích thước theo nhu cầu của bạn
            height: 50,
            anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5) // Đặt anchor ở vị trí trung tâm của Text Element
        });
        // Gắn Text Element vào Entity
        this.textEntity.setLocalPosition(0, 2, -0.02); // Đặt vị trí của Text Element trong hình hộp
        this.textEntity.setLocalEulerAngles(-90, -90, 0)
        this.textEntity.setLocalScale(0.023, 0.023, 0.023);
        this.boxModel.addChild(this.textEntity);

        this.start = this.getLocalPosition() // Điểm đầu (0, 0, 0)
        this.end = this.getLocalPosition() // Điểm cuối (10, 0, 10)
        this.duration = 0
        this.elapsed = 0;
    }

    update(dt) {
        if (this.run) {
            this.elapsed += dt; // Cộng thêm thời gian trôi qua
            var t = Math.min(this.elapsed / this.duration, 1);
            var newPosition = new pc.Vec3();
            newPosition.lerp(this.start, this.end, this.speed * dt);
            this.setPosition(newPosition);

            // Kiểm tra nếu đối tượng đã đạt được điểm cuối
            if (t === 1) {
                this.start = this.getLocalPosition()
                this.end = this.queue.dequeue();
                this.duration = Helper.getDistance3D(this.start, this.end) / this.speed
                // this.duration *= 10
                this.elapsed = 0;
                this.setLocalEulerAngles(0, Helper.toAngleDegree(Helper.getAngle(
                    this.start.z,
                    this.start.x,
                    this.end.z, this.end.x) - 90), 0)
            }
        }
    }

    // update(position, deltaTime) {
    //     this.angle = Helper.getAngle(this.getLocalPosition().z, this.getLocalPosition().x,
    //         position.z, position.x);
    //     this.setLocalEulerAngles(0, Helper.toAngleDegree(this.angle - 90), 0)
    //     this.translate(this.speed * Math.sin(this.angle) * deltaTime, 0, this.speed * Math.cos(this.angle) * deltaTime)
    // }

}