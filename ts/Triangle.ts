import Particle from './Particle.js'
import Color from './Color.js'

export default class Triangle {
  p1: Particle;
  p2: Particle;
  p3: Particle;
  color: Color;

  constructor(p1:Particle, p2:Particle, p3:Particle, color:Color=null) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    if (color) {
      this.color = color;
    } else {
      this.color = Color.RandomColor();
    }
  }

  get center() {
    return this.p1.pos.add(this.p2.pos).add(this.p3.pos).mul(1/3);
  }
}
