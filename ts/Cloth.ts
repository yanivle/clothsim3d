import Entity from './Entity.js'
import Spring from './Spring.js'
import UIValue from './UIValue.js'
import Vec2 from './Vec2.js'
import FixedForce from './FixedForce.js'
import Rect from './Rect.js'
import Mouse from './Mouse.js'
import AirResistance from './AirResistance.js'

export default class Cloth {
  springs: Spring[];
  joints: Entity[];
  name: string;
  offset: Vec2;
  color: string;
  wind: FixedForce;
  gravity: FixedForce;
  mouse: Mouse;
  elapsed_time: number;

  constructor(name:string, offset:Vec2, color:string, mouse:Mouse, lock_side:string) {
    this.name = name;
    this.offset = offset;
    this.color = color;
    this.mouse = mouse;
    this.elapsed_time = 0;
    this.init(lock_side);
  }

  init(lock_side):void {
    const GRID_WIDTH = UIValue("GRID_WIDTH", 25, 10, 50, 1);
    const GRID_HEIGHT = UIValue("GRID_HEIGHT", 15, 10, 50, 1);
    const STRING_LEN = UIValue("STRING_LEN", 10, 1, 50, 1);
    const rest_len_frac = UIValue("rest_len_frac", 1, 0, 3, 0.1);
    const spring_k = UIValue("spring_k", 20, 1, 1000, 1);

    this.wind = new FixedForce(new Vec2());
    this.gravity = new FixedForce(new Vec2(0, UIValue("gravity", 20, -40, 100, 1)));

    let springs = this.springs = [];
    let joints = this.joints = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        let joint = new Entity(new Vec2(this.offset.x + x * STRING_LEN,
                                        this.offset.y + y * STRING_LEN),
                               1, 1,
                               new Vec2(0, 0));
        // if (y == 0 || x == 0 || y == GRID_HEIGHT - 1 || x == GRID_WIDTH - 1) {
        if (lock_side == 'x' && x == 0) {
          joint.lock = true;
        }
        if (lock_side == 'y' && y == 0) {
          joint.lock = true;
        }
        let connect_to = [];
        if (x > 0) {
          connect_to.push(joints[x - 1 + y * GRID_WIDTH]);
        }
        if (y > 0) {
          connect_to.push(joints[x + (y - 1) * GRID_WIDTH]);
        }
        if (x > 0 && y > 0) {
          connect_to.push(joints[x - 1 + (y - 1) * GRID_WIDTH]);
        }
        if (x < GRID_WIDTH - 1 && y > 0) {
          connect_to.push(joints[x + 1 + (y - 1) * GRID_WIDTH]);
        }
        connect_to.forEach(otherJoint => {
          let len = joint.box.pos.sub(otherJoint.box.pos).len;
          let spring = new Spring(joint, otherJoint, len * rest_len_frac,
                                  spring_k);
          springs.push(spring);
        })

        joints.push(joint);
      }
    }
    // joints[0].lock = true;
    // joints[GRID_WIDTH * GRID_HEIGHT - GRID_WIDTH].lock = true;
    // joints[GRID_WIDTH-1].lock = true;
  }

  draw(context:CanvasRenderingContext2D):void {
    this.wind.draw(context, 'yellow', this.offset.add(new Vec2(500, 0)));
    this.gravity.draw(context, 'orange', this.offset.add(new Vec2(500, 0)));

    this.springs.forEach(spring => {
      spring.draw(context);
    });

    // this.joints.forEach(joint => {
    //   joint.draw(context, this.color);
    // });
  }

  pull(point, dir, influence):void {
    this.joints.forEach(joint => {
      let dist = point.sub(joint.box.pos).len;
      if (dist <= influence) {
        joint.prev_pos = joint.box.pos.add(dir.div(10));
        // joint.prev_pos = joint.box.pos.copy();
        joint.force.izero();
        joint.vel.izero();
      }
    });
  }

  tear(point, influence):void {
    this.joints.forEach(joint => {
      let dist = point.sub(joint.box.pos).len;
      if (dist <= influence) {
        joint.springs.forEach(spring => {
          spring.active = false;
        });
      }
    });
  }

  simulate(delta_time):void {
    const magic_constant = UIValue(this.name + "_magic", 0.99, 0, 1, 0.01);

    // this.wind.dir.x = UIValue("wind", 10, 0, 50, 1);
    this.elapsed_time += delta_time;
    this.wind.dir.x = (UIValue("wind_mag", 20, 0, 50, 1) *
                       Math.sin(this.elapsed_time /
                                UIValue("wind_freq", 30, 0, 600, 3)));
    this.gravity.dir.y = UIValue("gravity", 20, -40, 100, 1);
    this.joints.forEach(joint => {
      joint.updatePosition(delta_time, magic_constant);
    });
    this.joints.forEach(joint => {
      joint.force.izero();
      this.gravity.apply(joint);
      this.wind.apply(joint);
    });
    if (this.mouse.down) {
      this.tear(this.mouse.pos, 5);
    }
    this.springs.forEach(spring => {
      spring.apply();
    });
    this.joints.forEach(joint => {
      const air_resistance = new AirResistance(UIValue("air_resistance", 0, 0, 1, 0.0001));
      air_resistance.apply(joint);
      joint.updateVelocities(delta_time);
    });
  }
}
