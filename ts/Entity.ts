import Rect from './Rect.js'
import Vec2 from './Vec2.js'
import UIValue from './UIValue.js'
import Spring from './Spring.js'

export default class Entity {
  vel: Vec2;
  box: Rect;
  prev_pos: Vec2;
  lock: boolean;
  force: Vec2;
  springs: Spring[];

  constructor(pos, width, height, vel) {
    this.vel = vel;
    this.box = new Rect(width, height);
    this.box.pos = pos;
    this.prev_pos = new Vec2(pos.x, pos.y);
    this.lock = false;
    this.force = new Vec2();
    this.springs = [];
  }

  updatePosition(delta_time:number, magic_constant:number=0.99):void {
    if (this.lock) {
      return;
    }
    let new_x = this.box.pos.x + (-this.box.pos.x + this.prev_pos.x) * magic_constant + this.vel.x * delta_time;
    let new_y = this.box.pos.y + (-this.box.pos.y + this.prev_pos.y) * magic_constant + this.vel.y * delta_time;
    this.prev_pos.x = this.box.pos.x;
    this.prev_pos.y = this.box.pos.y;
    this.box.pos.x = new_x;
    this.box.pos.y = new_y;
    // this.box.pos.x += this.vel.x * delta_time;
    // this.box.pos.y += this.vel.y * delta_time;
    this.force.x = this.force.y = 0;
  }

  updateVelocities(delta_time):void {
    // const MAX_FORCE_MAG = 2*100;
    // const MAX_VEL_MAG = 100*100;
    // let force_mag = this.force.len;
    // if (force_mag > MAX_FORCE_MAG) {
    //   this.force.imul(MAX_FORCE_MAG / force_mag);
    // }
    const velocity_damping = UIValue("velocity_damping", 1, 0.99, 1, 0.0001);
    this.vel.imul(velocity_damping);
    this.vel.x += this.force.x * delta_time;
    this.vel.y += this.force.y * delta_time;
    // let vel_mag = this.vel.len;
    // if (vel_mag > MAX_VEL_MAG) {
    //   this.vel.imul(MAX_VEL_MAG / vel_mag);
    // }
  }

  draw(context, color):void {
    context.fillStyle = color;
    context.fillRect(this.box.left, this.box.top,
                     this.box.width, this.box.height);
  }

  collideWithBBox(bbox:Rect) {
    if (this.box.left < bbox.left) {
      this.box.left = bbox.left;
      this.vel.x = Math.abs(this.vel.x) * 0.5;
    }
    if (this.box.right > bbox.right) {
      this.box.right = bbox.right;
      this.vel.x = -Math.abs(this.vel.x) * 0.5;
    }
    if (this.box.top < bbox.top) {
      this.box.top = bbox.top;
      this.vel.y = Math.abs(this.vel.y) * 0.5;
    }
    if (this.box.bottom > bbox.bottom) {
      this.box.bottom = bbox.bottom;
      this.vel.y = -Math.abs(this.vel.y) * 0.5;
    }
  }

  // get moment() {
  //   let m = 1;
  //   return m * this.vel.len;
  // }
  //
  // get energy() {
  //   let m = 1;
  //   return m * (this.vel.x * this.vel.x + this.vel.y * this.vel.y) / 2;
  // }
  //
  // collide(other) {
  //   let collision_result = this.box.collide(other.box);
  //   if (collision_result.has_collision()) {
  //     let t = this.vel;
  //     this.vel = other.vel;
  //     other.vel = t;
  //   }
  // }
}
