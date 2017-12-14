import UIValue from './UIValue.js';
export default class Spring {
    constructor(e1, e2) {
        this.e1 = e1;
        this.e2 = e2;
        this.resting_len = e2.pos.sub(e1.pos).len;
        this.active = true;
        this.e1.springs.push(this);
        this.e2.springs.push(this);
    }
    draw(context, color = 'purple') {
        if (this.active === false) {
            return;
        }
        context.beginPath();
        context.moveTo(this.e1.pos.x, this.e1.pos.y);
        context.lineTo(this.e2.pos.x, this.e2.pos.y);
        let c = Math.abs(this.e1.pos.z - this.e2.pos.z) * 100;
        if (c > 255)
            c = 255;
        context.strokeStyle = 'rgb(255,255,' + c + ')';
        // context.strokeStyle = color;
        context.lineWidth = 1;
        context.stroke();
    }
    satisfy() {
        if (this.active === false) {
            return;
        }
        let ent1ToEnt2 = this.e2.pos.sub(this.e1.pos);
        let dist = ent1ToEnt2.len;
        if (dist < this.resting_len) {
            return;
        }
        if (dist > this.resting_len * UIValue('max_stretch', 10, 1, 100, 0.1)) {
            this.active = false;
            return;
        }
        let mag = (dist - this.resting_len) / dist;
        let correction = ent1ToEnt2.imul(0.5).imul(mag);
        if (this.e1.lock == false) {
            this.e1.pos.iadd(correction);
        }
        if (this.e2.lock == false) {
            this.e2.pos.isub(correction);
        }
    }
}
