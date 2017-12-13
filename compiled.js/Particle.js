import Vec2 from './Vec2.js';
export default class Particle {
    constructor(pos, initial_vel = null) {
        this.pos = pos;
        if (initial_vel) {
            this.prev_pos = pos.sub(initial_vel);
        }
        else {
            this.prev_pos = pos.copy();
        }
        this.lock = false;
        this.force = new Vec2();
        this.springs = [];
    }
    get vel() {
        return this.pos.sub(this.prev_pos);
    }
    verlet(delta_time) {
        // implement locking in constraint solving instead of here
        if (this.lock) {
            return;
        }
        let t = this.pos.copy();
        let a = this.force.mul(delta_time * delta_time);
        let v = this.vel;
        this.pos.iadd(v.add(a));
        this.prev_pos = t;
    }
    draw(context, color) {
        context.fillStyle = color;
        context.fillRect(this.pos.x, this.pos.y, 1, 1);
    }
}
