import Sphere from './Sphere.js';
import Particle from './Particle.js';
import Triangle from './Triangle.js';
import Renderer from './Renderer.js';
import Spring from './Spring.js';
import UIValue from './UIValue.js';
import Vec3 from './Vec3.js';
import FixedForce from './FixedForce.js';
const sphere = new Sphere(new Vec3(0, 0, 1), 50);
export default class Cloth {
    constructor(name, offset, width, height, color, mouse, lock_side, string_width = 1) {
        this.renderer = new Renderer();
        this.name = name;
        this.offset = offset;
        this.color = color;
        this.mouse = mouse;
        this.string_width = string_width;
        mouse.onmousedown_callsbacks.push(() => {
            this.tear(mouse.pos, 200);
        });
        mouse.onmousemove_callsbacks.push(() => {
            if (mouse.down) {
                this.tear(mouse.pos, 200);
            }
        });
        this.elapsed_time = 0;
        this.init(width, height, lock_side);
    }
    init(width, height, lock_side) {
        // const GRID_WIDTH = UIValue("GRID_WIDTH", 25, 10, 50, 1);
        const GRID_WIDTH = width;
        // const GRID_HEIGHT = UIValue("GRID_HEIGHT", 15, 10, 50, 1);
        const GRID_HEIGHT = height;
        const STRING_LEN = 25; //UIValue("STRING_LEN", 25, 1, 50, 1);
        this.wind = new FixedForce(new Vec3());
        this.gravity = new FixedForce(new Vec3(0, UIValue("gravity", 20, -40, 100, 1)));
        let springs = this.springs = [];
        let joints = this.joints = [];
        let triangles = this.triangles = [];
        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                let joint;
                if (lock_side == 'x') {
                    joint = new Particle(new Vec3(this.offset.x + x * STRING_LEN, this.offset.y, y * STRING_LEN));
                    if (x == 0) {
                        joint.lock = true;
                    }
                }
                else if (lock_side == 'y') {
                    joint = new Particle(new Vec3(this.offset.x + x * STRING_LEN, this.offset.y + y * STRING_LEN, 0));
                    if (y == 0) {
                        joint.lock = true;
                        // joints[0].lock = true;
                        // joints[GRID_WIDTH * GRID_HEIGHT - GRID_WIDTH].lock = true;
                    }
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
                    let t = new Triangle(joint, joints[x + (y - 1) * GRID_WIDTH], joints[x - 1 + (y - 1) * GRID_WIDTH]);
                    let t2 = new Triangle(joint, joints[x - 1 + (y - 1) * GRID_WIDTH], joints[x - 1 + y * GRID_WIDTH]);
                    triangles.push(t);
                    triangles.push(t2);
                }
                if (x < GRID_WIDTH - 1 && y > 0) {
                    connect_to.push(joints[x + 1 + (y - 1) * GRID_WIDTH]);
                }
                connect_to.forEach(otherJoint => {
                    let spring = new Spring(joint, otherJoint);
                    springs.push(spring);
                });
                joints.push(joint);
            }
            // joints[0].lock = true;
            // joints[GRID_WIDTH-1].lock = true;
        }
        // joints[0].lock = true;
        // joints[GRID_WIDTH * GRID_HEIGHT - GRID_WIDTH].lock = true;
        // joints[GRID_WIDTH-1].lock = true;
    }
    findClosest(point) {
        let closest_dist2 = 1000000000;
        let closest_joint = this.joints[0];
        this.joints.forEach(joint => {
            let len2 = joint.pos.sub(point).len2;
            if (len2 < closest_dist2) {
                closest_dist2 = len2;
                closest_joint = joint;
            }
        });
        return closest_joint;
    }
    draw(context) {
        sphere.draw(context);
        let w = context.canvas.width;
        let h = context.canvas.height;
        this.renderer.light_source.x = w / 2 + Math.cos(this.elapsed_time / 5) * 200;
        this.renderer.light_source.y = h / 2 + Math.sin(this.elapsed_time / 5) * 200;
        // this.wind.draw(context, 'yellow', this.offset.add(new Vec3(500, 0)));
        // this.gravity.draw(context, 'orange', this.offset.add(new Vec3(500, 0)));
        // this.triangles.sort((t1, t2) => {
        //   let max_z1 = Math.max(t1.p1.pos.z, t1.p2.pos.z, t1.p3.pos.z);
        //   let max_z2 = Math.max(t2.p1.pos.z, t2.p2.pos.z, t2.p3.pos.z);
        //   if(max_z1 < max_z2) return -1;
        //   if(max_z1 > max_z2) return 1;
        //   return 0;
        // });
        this.triangles.forEach(triangle => {
            this.renderer.draw(triangle, context);
        });
        context.fillStyle = 'red';
        context.fillRect(this.renderer.light_source.x - 1, this.renderer.light_source.y - 1, 10, 10);
        // this.springs.forEach(spring => {
        //   spring.draw(context, this.color, this.string_width);
        // });
        // this.selected_joints.forEach(joint => {
        //   joint.draw(context, "red");
        // });
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
    tear(point, influence2) {
        let joints_to_remove = [];
        this.joints.forEach(joint => {
            let dist2 = point.sub(joint.pos.toVec2()).len2;
            if (dist2 <= influence2) {
                joints_to_remove.push(joint);
                joint.springs.forEach(spring => {
                    let other = spring.e1;
                    if (other == joint) {
                        other = spring.e2;
                    }
                    let idx = other.springs.indexOf(spring);
                    other.springs.splice(idx, 1);
                    spring.active = false;
                    idx = this.springs.indexOf(spring);
                    this.springs.splice(idx, 1);
                });
            }
        });
        let triangles_to_remove = [];
        joints_to_remove.forEach(joint => {
            this.joints.splice(this.joints.indexOf(joint), 1);
            this.triangles.forEach(triangle => {
                if (triangle.p1 == joint || triangle.p2 == joint || triangle.p3 == joint) {
                    triangles_to_remove.push(triangle);
                }
            });
        });
        triangles_to_remove.forEach(triangle => {
            this.triangles.splice(this.triangles.indexOf(triangle), 1);
        });
    }
    // select(point, influence2):void {
    //   this.joints.forEach(joint => {
    //     let dist2 = point.sub(joint.pos).len2;
    //     if (dist2 <= influence2) {
    //       this.selected_joints.push(joint);
    //     }
    //   });
    // }
    //
    satisfy_constraints() {
        // const constraint_iterations = UIValue("constraint_iterations", 3, 1, 10, 1);
        for (let i = 0; i < 3; i++) {
            this.springs.forEach(spring => {
                spring.satisfy();
            });
            // this.joints.forEach(joint => {
            //   if (!joint.lock) {
            //     if (this.selected_joints.indexOf(joint) >= 0) {
            //       joint.pos.x = this.mouse.pos.x;
            //       joint.pos.y = this.mouse.pos.y;
            //     }
            //   }
            // });
            this.joints.forEach(joint => {
                if (!joint.lock) {
                    sphere.constrain(joint);
                }
            });
        }
    }
    accumulate_forces(delta_time) {
        this.elapsed_time += delta_time;
        this.wind.dir.x = Math.sin(this.elapsed_time * UIValue("wind_freq", 0.3, 0.1, 10, 0.1)) * UIValue("wind_mag", 0, 0, 160, 40);
        this.wind.dir.z = Math.sin(2 * this.elapsed_time * UIValue("wind_freq", 0.3, 0.1, 10, 0.1)) * UIValue("wind_mag", 0, 0, 160, 40) * 0.1;
        this.gravity.dir.y = UIValue("gravity", 20, -40, 100, 1);
        this.joints.forEach(joint => {
            joint.force.izero();
            this.gravity.apply(joint);
            this.wind.apply(joint);
            joint.verlet(delta_time);
        });
    }
    simulate(delta_time) {
        // this.pull(this.mouse.pos.toVec3(), this.mouse.direction.div(100).toVec3(), 10);
        sphere.center.x = this.mouse.pos.x;
        sphere.center.y = this.mouse.pos.y;
        sphere.center.z = UIValue("sphere_z", 20, 0, 50, 0.5);
        sphere.radius = UIValue("sphere_radius", 100, 1, 500, 1);
        // light_source.x = this.mouse.pos.x;
        // light_source.y = this.mouse.pos.y;
        this.accumulate_forces(delta_time);
        this.satisfy_constraints();
    }
}