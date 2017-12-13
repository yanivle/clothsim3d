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
  radius: number;

  constructor(center:Vec3=new Vec3(), radius:number) {
    this.center = center.copy();
    this.radius = radius;
  }

  collideWithParticle(particle:Particle) {
    let vec_from_center = particle.pos.sub(this.center);
    let dist = vec_from_center.len;
    if (dist < this.radius) {
      return new CollisionResult(true, vec_from_center.mul(this.radius / dist));
    }
    return new CollisionResult(false);
  }

  constrain(particle) {
    let collision_res = this.collideWithParticle(particle);
    if (collision_res.collided) {
      particle.pos = collision_res.collision_point;
    }
  }

  draw(context) {
    context.fillStyle = 'green';
    context.fillRect(this.center.x, this.center.y, this.radius, this.radius);
  }
}
