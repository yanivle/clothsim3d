import UIValue from './UIValue.js';
const MAX_MAG = 100;
export default class Spring {
    constructor(entity1, entity2, resting_len, k) {
        this.entity1 = entity1;
        this.entity2 = entity2;
        this.resting_len = resting_len;
        this.k = k;
        this.max_stretch = UIValue("max_stretch", 5, 0.5, 1000, 0.5);
        this.tension = 0;
        this.active = true;
        this.entity1.springs.push(this);
        this.entity2.springs.push(this);
    }
    atRest() {
        return this.entity1.box.pos.sub(this.entity2.box.pos).len <= this.resting_len;
    }
    draw(context) {
        if (this.active === false) {
            return;
        }
        context.beginPath();
        context.moveTo(this.entity1.box.pos.x, this.entity1.box.pos.y);
        context.lineTo(this.entity2.box.pos.x, this.entity2.box.pos.y);
        let c = this.tension * 25 <= 255 ? this.tension * 25 : 255;
        c |= 0;
        c = 255 - c;
        let color = 'rgb(255,' + c + ',255)';
        context.strokeStyle = color;
        // // context.strokeStyle = 'purple';
        context.lineWidth = 1;
        context.stroke();
    }
    apply() {
        if (this.active === false) {
            return;
        }
        let ent1ToEnt2 = this.entity2.box.pos.sub(this.entity1.box.pos);
        let dist = ent1ToEnt2.len;
        let stretch = dist / this.resting_len;
        if (stretch > this.max_stretch) {
            this.active = false;
            return;
        }
        let mag = (dist - this.resting_len) / dist;
        if (mag > UIValue("tear", 1, 0.1, 10, 0.1)) {
            this.active = false;
            return;
        }
        if (mag <= 0) {
            // Loose - no tension
            return;
        }
        mag *= this.k;
        this.tension = mag;
        // if (Math.abs(mag) > MAX_MAG) {
        //   mag = MAX_MAG;
        // }
        let forceOnEnt1 = ent1ToEnt2.mul(mag);
        this.entity1.force.iadd(forceOnEnt1);
        let forceOnEnt2 = forceOnEnt1;
        forceOnEnt2.inegate();
        this.entity2.force.iadd(forceOnEnt2);
    }
}
