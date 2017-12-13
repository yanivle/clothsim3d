import Particle from './Particle.js';
import Spring from './Spring.js';
import UIValue from './UIValue.js';
import Vec2 from './Vec2.js';
import FixedForce from './FixedForce.js';
export default class Cloth {
    constructor(name, offset, color, mouse, lock_side) {
        this.name = name;
        this.offset = offset;
        this.color = color;
        this.mouse = mouse;
        this.elapsed_time = 0;
        this.init(lock_side);
    }
    init(lock_side) {
        const GRID_WIDTH = UIValue("GRID_WIDTH", 25, 10, 50, 1);
        const GRID_HEIGHT = UIValue("GRID_HEIGHT", 15, 10, 50, 1);
        const STRING_LEN = UIValue("STRING_LEN", 10, 1, 50, 1);
        this.wind = new FixedForce(new Vec2());
        this.gravity = new FixedForce(new Vec2(0, UIValue("gravity", 20, -40, 100, 1)));
        let springs = this.springs = [];
        let joints = this.joints = [];
        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                let joint = new Particle(new Vec2(this.offset.x + x * STRING_LEN, this.offset.y + y * STRING_LEN));
                // if (y == 0 || x == 0 || y == GRID_HEIGHT - 1 || x == GRID_WIDTH - 1) {
                // if (lock_side == 'x' && x == 0) {
                // joint.lock = true;
                // }
                // if (lock_side == 'y' && y == 0) {
                //   joint.lock = true;
                // }
                let connect_to = [];
                if (x > 0) {
                    connect_to.push(joints[x - 1 + y * GRID_WIDTH]);
                }
                if (y > 0) {
                    connect_to.push(joints[x + (y - 1) * GRID_WIDTH]);
                }
                // if (x > 0 && y > 0) {
                //   connect_to.push(joints[x - 1 + (y - 1) * GRID_WIDTH]);
                // }
                // if (x < GRID_WIDTH - 1 && y > 0) {
                //   connect_to.push(joints[x + 1 + (y - 1) * GRID_WIDTH]);
                // }
                connect_to.forEach(otherJoint => {
                    let spring = new Spring(joint, otherJoint);
                    springs.push(spring);
                });
                joints.push(joint);
            }
        }
        joints[0].lock = true;
        // joints[GRID_WIDTH * GRID_HEIGHT - GRID_WIDTH].lock = true;
        joints[GRID_WIDTH - 1].lock = true;
    }
    draw(context) {
        this.wind.draw(context, 'yellow', this.offset.add(new Vec2(500, 0)));
        this.gravity.draw(context, 'orange', this.offset.add(new Vec2(500, 0)));
        this.springs.forEach(spring => {
            spring.draw(context);
        });
        // this.joints.forEach(joint => {
        //   joint.draw(context, this.color);
        // });
    }
    pull(point, dir, influence) {
        this.joints.forEach(joint => {
            let dist = point.sub(joint.pos).len;
            if (dist <= influence) {
                joint.prev_pos = joint.pos.add(dir.div(10));
                // joint.prev_pos = joint.pos.copy();
                joint.force.izero();
                // joint.vel.izero();
            }
        });
    }
    tear(point, influence) {
        this.joints.forEach(joint => {
            let dist = point.sub(joint.pos).len;
            if (dist <= influence) {
                joint.springs.forEach(spring => {
                    spring.active = false;
                });
            }
        });
    }
    satisfy_constraints() {
        const constraint_iterations = UIValue("constraint_iterations", 3, 1, 10, 1);
        for (let i = 0; i < constraint_iterations; i++) {
            this.springs.forEach(spring => {
                spring.satisfy();
            });
        }
    }
    accumulate_forces(delta_time) {
        this.elapsed_time += delta_time;
        this.wind.dir.x = UIValue("wind_mag", 50, 0, 500, 1);
        // this.wind.dir.x = (UIValue("wind_mag", 50, 0, 500, 1) *
        //                    Math.sin(this.elapsed_time /
        //                             UIValue("wind_freq", 25, 1, 100, 1)));
        this.gravity.dir.y = UIValue("gravity", 20, -40, 100, 1);
        this.joints.forEach(joint => {
            joint.force.izero();
            this.gravity.apply(joint);
            this.wind.apply(joint);
            joint.verlet(delta_time);
        });
    }
    simulate(delta_time) {
        this.accumulate_forces(delta_time);
        this.satisfy_constraints();
    }
}
