import Particle from './Particle.js'
import Vec3 from './Vec3.js'

class CollisionResult {
  collided: boolean;
  collision_point: Vec3;

  constructor(collided=false, collision_point=null) {
    this.collided = collided;
    this.collision_point = collision_point;
  }
}

export default class Sphere {
  center: Vec3;
  _radius: number;
  _radius2: number;

  constructor(center:Vec3=new Vec3(), radius:number) {
    this.center = center.copy();
    this.radius = radius;
  }

  set radius(radius:number) {
    this._radius = radius;
    this._radius2 = radius * radius;
  }

  get radius():number {
    return this._radius;
  }

  collideWithParticle(particle:Particle) {
    let vec_from_center = particle.pos.sub(this.center);
    let dist2 = vec_from_center.len2;
    if (dist2 < this._radius2) {
      let dist= vec_from_center.len;
      let collision_point = this.center.add(vec_from_center.mul(this.radius / dist));
      return new CollisionResult(true, collision_point);
    }
    return new CollisionResult(false);
  }

  constrain(particle) {
    let collision_res = this.collideWithParticle(particle);
    if (collision_res.collided) {
      particle.pos = collision_res.collision_point;
      particle.dampen(0.9999);
    }
  }

  draw(context) {
    context.fillStyle = 'green';
    context.fillRect(this.center.x-this.radius/2,
                     this.center.y-this.radius/2,
                     this.radius, this.radius);
  }
}
