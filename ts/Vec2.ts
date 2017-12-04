export default class Vec2 {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vec2(this.x, this.y);
  }

  izero() {
    this.x = this.y = 0;
  }

  get len() {
    return Math.sqrt(this.len2);
  }

  get len2() {
    return this.x * this.x + this.y * this.y;
  }

  set len(new_len) {
    let frac = new_len / this.len;
    this.imul(frac);
  }

  imul(a) {
    this.x *= a;
    this.y *= a;
  }

  mul(a) {
    return new Vec2(this.x * a, this.y * a);
  }

  idiv(a) {
    let b = 1 / a;
    this.imul(b);
  }

  div(a) {
    let b = 1 / a;
    return this.mul(b);
  }

  iadd(other) {
    this.x += other.x;
    this.y += other.y;
  }

  add(other) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  isub(other) {
    this.x -= other.x;
    this.y -= other.y;
  }

  sub(other) {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  inegate() {
    this.x = -this.x;
    this.y = -this.y;
  }

  negate() {
    return new Vec2(-this.x, -this.y);
  }
}