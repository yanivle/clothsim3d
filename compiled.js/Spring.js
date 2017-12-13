const MAX_MAG = 100;
let delme = 0;
export default class Spring {
    constructor(entity1, entity2) {
        this.entity1 = entity1;
        this.entity2 = entity2;
        this.resting_len = entity2.pos.sub(entity1.pos).len;
        this.active = true;
        this.entity1.springs.push(this);
        this.entity2.springs.push(this);
    }
    draw(context) {
        if (this.active === false) {
            return;
        }
        context.beginPath();
        context.moveTo(this.entity1.pos.x, this.entity1.pos.y);
        context.lineTo(this.entity2.pos.x, this.entity2.pos.y);
        context.strokeStyle = 'purple';
        context.lineWidth = 1;
        context.stroke();
    }
    satisfy() {
        if (this.active === false) {
            return;
        }
        let ent1ToEnt2 = this.entity2.pos.sub(this.entity1.pos);
        let dist = ent1ToEnt2.len;
        if (dist < this.resting_len) {
            return;
        }
        let mag = (dist - this.resting_len) / dist;
        let correction = ent1ToEnt2.imul(0.5).imul(mag);
        if (this.entity1.lock == false) {
            this.entity1.pos.iadd(correction);
        }
        if (this.entity2.lock == false) {
            this.entity2.pos.isub(correction);
        }
    }
}
