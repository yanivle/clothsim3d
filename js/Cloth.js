import Particle from './Particle.js';
import Spring from './Spring.js';
import UIValue from './UIValue.js';
import Vec3 from './Vec3.js';
import FixedForce from './FixedForce.js';
// const sphere = new Sphere(new Vec3(150, 150, 0), 10);
export default class Cloth {
    constructor(name, offset, color, mouse, lock_side) {
        this.name = name;
        this.offset = offset;
        this.color = color;
        this.mouse = mouse;
        mouse.onmouseup_callsbacks.push(() => {
            this.tear(mouse.pos.toVec3(), 10);
        });
        this.elapsed_time = 0;
        this.init(lock_side);
    }
    init(lock_side) {
        const GRID_WIDTH = UIValue("GRID_WIDTH", 25, 10, 50, 1);
        const GRID_HEIGHT = UIValue("GRID_HEIGHT", 15, 10, 50, 1);
        const STRING_LEN = UIValue("STRING_LEN", 10, 1, 50, 1);
        this.wind = new FixedForce(new Vec3());
        this.gravity = new FixedForce(new Vec3(0, UIValue("gravity", 20, -40, 100, 1)));
        let springs = this.springs = [];
        let joints = this.joints = [];
        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                let joint = new Particle(new Vec3(this.offset.x + x * STRING_LEN, this.offset.y + y * STRING_LEN));
                if (lock_side == 'y' && x == 0) {
                    joint.lock = true;
                    // joints[0].lock = true;
                    // joints[GRID_WIDTH-1].lock = true;
                }
                if (lock_side == 'x' && y == 0) {
                    joint.lock = true;
                    // joints[0].lock = true;
                    // joints[GRID_WIDTH * GRID_HEIGHT - GRID_WIDTH].lock = true;
                }
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
        // joints[0].lock = true;
        // joints[GRID_WIDTH * GRID_HEIGHT - GRID_WIDTH].lock = true;
        // joints[GRID_WIDTH-1].lock = true;
    }
    draw(context) {
        // sphere.draw(context);
        this.wind.draw(context, 'yellow', this.offset.add(new Vec3(500, 0)));
        this.gravity.draw(context, 'orange', this.offset.add(new Vec3(500, 0)));
        this.springs.forEach(spring => {
            spring.draw(context, this.color);
        });
        // this.joints.forEach(joint => {
        //   joint.draw(context, this.color);
        // });
    }
    pull(point, dir, influence) {
        this.joints.forEach(joint => {
            let dist = point.sub(joint.pos).len;
            if (dist <= influence) {
                joint.prev_pos = joint.pos.sub(dir);
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
            // this.joints.forEach(joint => {
            //   if (!joint.lock) {
            //     sphere.constrain(joint);
            //   }
            // });
        }
    }
    accumulate_forces(delta_time) {
        this.elapsed_time += delta_time;
        this.wind.dir.x = UIValue("wind_mag", 0, 0, 500, 1);
        this.gravity.dir.y = UIValue("gravity", 20, -40, 100, 1);
        this.joints.forEach(joint => {
            joint.force.izero();
            this.gravity.apply(joint);
            this.wind.apply(joint);
            joint.verlet(delta_time);
        });
    }
    simulate(delta_time) {
        this.pull(this.mouse.pos.toVec3(), this.mouse.direction.div(100).toVec3(), 10);
        this.accumulate_forces(delta_time);
        this.satisfy_constraints();
    }
}
