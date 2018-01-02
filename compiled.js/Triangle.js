import Vec3 from './Vec3.js';
export const light_source = new Vec3(0, 0, -200);
// light_vec.normalize();
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
export default class Triangle {
    constructor(p1, p2, p3, color = null) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        if (color) {
            this.color = color;
        }
        else {
            this.color = getRandomColor();
        }
    }
    get center() {
        return this.p1.pos.add(this.p2.pos).add(this.p3.pos).mul(1 / 3);
    }
    draw(context) {
        context.beginPath();
        // let v1 = this.p2.pos.sub(this.p1.pos);
        // let v2 = this.p3.pos.sub(this.p1.pos);
        // let normal = v1.cross(v2);
        // normal.normalize();
        // let light_vec = light_source.sub(this.center);
        // light_vec.normalize();
        // let cos_angle = normal.dot(light_vec);
        // cos_angle *= 255;
        // if (cos_angle < 0) {
        //   cos_angle = 0;
        // }
        // cos_angle += 50;
        // if (cos_angle > 255) {
        //   cos_angle = 255;
        // }
        //
        // context.fillStyle = 'rgb(' + (cos_angle | 0) + ', 0, 0)';
        context.fillStyle = this.color;
        context.moveTo(this.p1.pos.x | 0, this.p1.pos.y | 0);
        context.lineTo(this.p2.pos.x | 0, this.p2.pos.y | 0);
        context.lineTo(this.p3.pos.x | 0, this.p3.pos.y | 0);
        context.fill();
    }
}
