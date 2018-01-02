import Color from './Color.js';
import Vec3 from './Vec3.js';
import UIValue from './UIValue.js';
export const light_source = new Vec3(0, 0, -200);
// light_vec.normalize();
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
    draw(context) {
        context.beginPath();
        // TODO: refactor this into a Renderer class.
        let v1 = this.p2.pos.sub(this.p1.pos);
        let v2 = this.p3.pos.sub(this.p1.pos);
        let normal = v1.cross(v2);
        normal.normalize();
        let light_vec = light_source.sub(this.center);
        light_vec.normalize();
        let cos_angle = normal.dot(light_vec);
        context.fillStyle = this.color.multiply(cos_angle * UIValue('diffuse_light', 3, 0, 10, 1), UIValue('ambient_light', 0.5, 0, 1, 0.1));
        context.moveTo(this.p1.pos.x | 0, this.p1.pos.y | 0);
        context.lineTo(this.p2.pos.x | 0, this.p2.pos.y | 0);
        context.lineTo(this.p3.pos.x | 0, this.p3.pos.y | 0);
        context.fill();
    }
}
