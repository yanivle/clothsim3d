import Color from './Color.js';
export default class Triangle {
    constructor(p1, p2, p3, color = null) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        if (color) {
            this.color = color;
        }
        else {
            this.color = Color.RandomColor();
        }
    }
    get center() {
        return this.p1.pos.add(this.p2.pos).add(this.p3.pos).mul(1 / 3);
    }
}
