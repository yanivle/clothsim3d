import Vec3 from './Vec3.js';
import UIValue from './UIValue.js';
const w = 800;
const h = 600;
const w2 = w / 2;
const h2 = h / 2;
// Based on https://en.wikipedia.org/wiki/3D_projection
export function PerspectiveProjection(a) {
    if (UIValue('project', 1, 0, 1, 1) == 0) {
        return a;
    }
    let user_z = UIValue('user_z', 500, 0, 1000, 1);
    let z = user_z / (user_z - a.z);
    return new Vec3((a.x - w2) / z + w2, (a.y - h2) / z + h2, z);
}
export default class Renderer {
    constructor() {
        this.light_source = new Vec3(0, 0, -200);
    }
    draw(triangle, context) {
        context.beginPath();
        let v1 = triangle.p2.pos.sub(triangle.p1.pos);
        let v2 = triangle.p3.pos.sub(triangle.p1.pos);
        let normal = v1.cross(v2);
        normal.normalize();
        let light_vec = this.light_source.sub(triangle.center);
        light_vec.normalize();
        let cos_angle = normal.dot(light_vec);
        let transparent = cos_angle < 0;
        // let transparent = false;
        context.strokeStyle = context.fillStyle = triangle.color.multiply(cos_angle * UIValue('diffuse_light', 1.5, 0, 10, 0.1), UIValue('ambient_light', 0.25, 0, 1, 0.05), transparent);
        context.moveTo(triangle.p1.pos.x | 0, triangle.p1.pos.y | 0);
        context.lineTo(triangle.p2.pos.x | 0, triangle.p2.pos.y | 0);
        context.lineTo(triangle.p3.pos.x | 0, triangle.p3.pos.y | 0);
        // let p1 = PerspectiveProjection(triangle.p1.pos);
        // let p2 = PerspectiveProjection(triangle.p2.pos);
        // let p3 = PerspectiveProjection(triangle.p3.pos);
        // context.moveTo(p1.x|0, p1.y|0);
        // context.lineTo(p2.x|0, p2.y|0);
        // context.lineTo(p3.x|0, p3.y|0);
        context.fill();
        // context.lineWidth = 1;
        // context.stroke();
    }
}
