import Force from './Force.js';
export default class FixedForce extends Force {
    constructor(dir) {
        super();
        this.dir = dir;
    }
    apply(entity) {
        entity.force.iadd(this.dir);
    }
    draw(context, color, pos) {
        context.beginPath();
        context.moveTo(pos.x, pos.y);
        context.lineTo(pos.x + this.dir.x * 10, pos.y + this.dir.y * 10);
        context.strokeStyle = color;
        context.lineWidth = 3;
        context.stroke();
    }
}
