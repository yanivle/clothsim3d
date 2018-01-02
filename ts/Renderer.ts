import Vec3 from './Vec3.js'
import UIValue from './UIValue.js'

export default class Renderer {
  light_source:Vec3 = new Vec3(0, 0, -200);

  constructor() {
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

    context.fillStyle = triangle.color.multiply(cos_angle * UIValue('diffuse_light', 3, 0, 10, 1), UIValue('ambient_light', 0.5, 0, 1, 0.1));
    context.moveTo(triangle.p1.pos.x|0, triangle.p1.pos.y|0);
    context.lineTo(triangle.p2.pos.x|0, triangle.p2.pos.y|0);
    context.lineTo(triangle.p3.pos.x|0, triangle.p3.pos.y|0);
    context.fill();
  }
}
