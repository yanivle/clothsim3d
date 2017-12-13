import Rect from './Rect.js'
import Vec2 from './Vec2.js'
import UIValue from './UIValue.js'
import Spring from './Spring.js'

export default class Particle {
  pos: Vec2;
  prev_pos: Vec2;
  lock: boolean;
  force: Vec2;
  springs: Spring[];

  constructor(pos:Vec2, initial_vel:Vec2=null) {
    this.pos = pos;
    if (initial_vel) {
      this.prev_pos = pos.sub(initial_vel);
    } else {
      this.prev_pos = pos.copy();
    }
    this.lock = false;
    this.force = new Vec2();
    this.springs = [];
  }

  get vel():Vec2 {
    return this.pos.sub(this.prev_pos);
  }

  verlet(delta_time:number) {
    // implement locking in constraint solving instead of here
    if (this.lock) {
      return;
    }
    let t = this.pos.copy();
    let a = this.force.mul(delta_time*delta_time);
    let v = this.vel;
    this.pos.iadd(v.add(a));
    this.prev_pos = t;
  }

  draw(context, color):void {
    context.fillStyle = color;
    context.fillRect(this.pos.x, this.pos.y, 1, 1);
  }
}
