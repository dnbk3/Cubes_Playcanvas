import { Entity, Vec3 } from "playcanvas";
import { Spawner } from "../script/spawners/spawner";
import { Cube } from "./cube";
import { Time } from "../systems/time/time";


export const CubeStackManagerEvent = Object.freeze({
  CubeChange: "cubeChanged",
});

export class CubeStackManager extends Entity {
  static positionQueue = [];

  constructor(player, stackSpace = 1) {
    super("cubeStackManager");
    this.player = player;
    this.cubes = [];
    this.stackSpace = stackSpace;
    this.spawner = this.addScript(Spawner, {
      class: Cube,
      poolSize: 10,
    });
  }

  enqueuePosition(position) {
    CubeStackManager.positionQueue.push({
      position,
      time: Time.current,
    });
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

  spawnCubes(amount) {
    for (let i = 0; i < amount; i++) {
      this.spawnCube();
    }
  }

  spawnCube() {
    let cubeAhead;
    let isFirstCube = this.cubes.length === 0;
    if (isFirstCube) {
      cubeAhead = this.player;
    }
    else {
      cubeAhead = this.cubes[this.cubes.length - 1];
    }
    let spawnPos = cubeAhead.getPosition();
    spawnPos.z += this.stackSpace;
    let cube = this.spawner.spawnTo(spawnPos, this);
    this.cubes.push(cube);
    cube.setEulerAngles(cubeAhead.getEulerAngles());
    let delayTime = isFirstCube ? 0.5 : cubeAhead.mover.delayTime + 1;
    delayTime = Math.max(delayTime, 0.5);
    cube.reset(delayTime);
    return cube;
  }
}
