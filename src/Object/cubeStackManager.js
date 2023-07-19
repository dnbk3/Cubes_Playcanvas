import { Entity, Vec3 } from "playcanvas";
import { Spawner } from "../scripts/spawner";
import { Cube } from "./cube";
import { Time } from "../systems/time/time";
import { Helper } from "../Helper/Helper";
import { GameConstant } from "../GameConstant";


export const CubeStackManagerEvent = Object.freeze({
  CubeChange: "cubeChanged",
});

export class CubeStackManager extends Entity {

  constructor(player, stackSpace = 1) {
    super("cubeStackManager");
    this.player = player;
    this.positionQueue = [];
    this.cubes = [];
    this.stackSpace = stackSpace;
    this.spawner = this.addScript(Spawner, {
      class: Cube,
      poolSize: 0,
      args: 16
    });
  }

  enqueuePosition(position) {
    this.positionQueue.push({
      position,
      time: Time.current,
    });

    if (this.positionQueue.length > GameConstant.LIMIT_TIME_POS_QUEUE / Time.dt) {
      this.positionQueue.splice(0, this.positionQueue.length - Math.floor(GameConstant.LIMIT_TIME_POS_QUEUE / Time.dt))
    }
  }

  stopMove() {
    this.cubes.forEach(cube => {
      cube.activeMove(false);
    });
  }

  startMove() {
    this.cubes.forEach(cube => {
      cube.activeMove(true);
    });
  }

  spawnCube(num) {
    if (this.player.speedUp) {
      this.player.setSpeedReduce(GameConstant.PLAYER_SPEED)
      var isPlayerSpeedUp = true
    }
    this.spawner.args = num
    let cubeAhead;
    let isFirstCube = this.cubes.length === 0 || num > this.cubes[0].number;
    var i = 0;
    if (isFirstCube) {
      cubeAhead = this.player;
      i = 1
    }
    else {
      while (i < this.cubes.length && this.cubes[i].number >= num) {
        i++;
      }
      cubeAhead = this.cubes[i - 1];
    }
    let spawnPos = cubeAhead.getPosition();
    spawnPos.z += this.stackSpace;
    let cube = this.spawner.spawnTo(spawnPos, this);

    cube.manager = this;

    if (isFirstCube) {
      this.cubes.splice(0, 0, cube);
    }
    else {
      this.cubes.splice(i, 0, cube);
    }
    cube.setEulerAngles(cubeAhead.getEulerAngles());
    let delayTime = isFirstCube ? 0.1 : cubeAhead.mover.delayTime + 0.1;
    cube.reset(delayTime);

    for (i; i < this.cubes.length; i++) {
      this.cubes[i].reset(this.cubes[i - 1].mover.delayTime + Helper.getScaleByNumber(this.cubes[i].number) / 2 + 0.1)
    }
    if (isPlayerSpeedUp) {
      this.player.setSpeedIncrease(GameConstant.PLAYER_SPEED_UP)
    }

    setTimeout(() => {
      this.checkUpdateSnake()
    }, 2000)
    return cube;
  }

  checkUpdateSnake() {

    if (this.player.speedUp) {
      this.player.setSpeedReduce(GameConstant.PLAYER_SPEED)
      var isPlayerSpeedUp = true
    }
    var isUpdate = false
    var x = 1;
    if (this.cubes[0] && this.player.number === this.cubes[0].number) {
      this.player.levelUp()
      this.cubes[0].destroy()
      this.cubes.splice(0, 1)
      this.cubes[0].reset(0.2)
      for (var i = 1; i < this.cubes.length; i++) {
        this.cubes[i].reset(this.cubes[i].mover.delayTime + Helper.getScaleByNumber(this.cubes[i].number) / 2 + 0.1)
      }
      x++
      isUpdate = true
    }
    for (x; x < this.cubes.length; x++) {
      if (this.cubes[x].number === this.cubes[x - 1].number) {
        let delayTime = this.cubes[x - 1].mover.delayTime
        this.cubes[x - 1].levelUp()
        this.cubes[x].destroy()
        this.cubes.splice(x, 1)

        for (var i = x; i < this.cubes.length; i++) {
          this.cubes[i].reset(delayTime + Helper.getScaleByNumber(this.cubes[i].number) + 0.005)
          delayTime += Helper.getScaleByNumber(this.cubes[i].number) + 0.005
        }
        x += 2
        isUpdate = true
      }
    }
    if (isPlayerSpeedUp) {
      this.player.setSpeedIncrease(GameConstant.PLAYER_SPEED_UP)
    }
    if (isUpdate) {
      setTimeout(() => {
        this.checkUpdateSnake()
      }, 2000)
    }
  }

  // sortUpdate() {
  //   console.log("sort");
  //   this.cubes = this.sortArrayDescending(this.cubes)
  //   var delay = 0;
  //   this.cubes.forEach(element => {
  //     delay += 0.1
  //     element.reset(delay)
  //   });
  // }

  // sortArrayDescending(arr) {
  //   arr.sort((a, b) => b.number - a.number);
  //   return arr;
  // }
}
