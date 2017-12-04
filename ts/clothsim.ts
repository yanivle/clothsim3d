import Vec2 from './Vec2.js'
import Entity from './Entity.js'
import FixedForce from './FixedForce.js'
import Rect from './Rect.js'
import Cloth from './Cloth.js'
import * as rand from './rand.js'
import UIValue from './UIValue.js'
import Mouse from './Mouse.js'

var canvas = <HTMLCanvasElement> <any> document.getElementById('canvas');
var context = <CanvasRenderingContext2D> <any> canvas.getContext('2d');
var mouse = new Mouse(canvas);
// var mouse_force = new FixedForce(mouse.direction);
// window.mouse = mouse;

// var clothes : Cloth[] = [
//   new Cloth('top', new Vec2(100, 100), 'red', mouse, 'x'),
//   new Cloth('bottom', new Vec2(100, 400), 'blue', mouse, 'y')];
var clothes : Cloth[] = [
    new Cloth('top', new Vec2(100, 100), 'red', mouse, 'y')];

function initKeyboard() {
  document.addEventListener('keydown', function(e) {
    if (e.code == 'Space') {
      shoot();
      e.preventDefault();
    }
  });
}

function draw() {
  // context.fillStyle = 'rgba(0,0,0,0.18)';
  context.fillStyle = 'rgba(0,0,0,1)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // mouse_force.draw(context, 'red', mouse.pos);

  clothes.forEach(cloth => {
    cloth.draw(context);
  });

  projectiles.forEach(projectile => {
    projectile.draw(context, 'yellow');
  });
}

function simulate(delta_time) {
  // mouse_force.dir = mouse.direction.div(3);
  clothes.forEach(cloth => {
    cloth.simulate(delta_time);
  });
  projectiles.forEach(projectile => {
    projectile.updatePosition(delta_time);
    projectile.force = new Vec2(0, 0.1);
    projectile.updateVelocities(delta_time);
    clothes.forEach(cloth => {
      cloth.tear(projectile.box.pos, 5);
    });
  });
}

let updateCounter = 0;
let updateInterval = 1 / 180;
function update(delta_time) {
  let speed = UIValue('speed', 10, 1, 200, 1);
  delta_time *= speed;
  updateCounter += delta_time;
  if (updateCounter > updateInterval * 10 * speed) {
    console.warn('Skipping frames!');
    updateCounter = updateInterval * 10 * speed;
  }
  while (updateCounter >= updateInterval) {
    simulate(updateInterval);
    updateCounter -= updateInterval;
  }
}

let projectiles:Entity[] = [];

function createProjectile(pos, vel) {
  projectiles.push(new Entity(pos, 5, 5, vel));
}

function shoot() {
  createProjectile(mouse.pos.copy(), mouse.direction.mul(5));
}

function initCloth() {
  clothes[0].init('y');
  // clothes[1].init('y');
}

function Main() {
  initKeyboard();
  initCloth();
  // window.joints = joints;
  // window.springs = springs;
  (<any>window).initCloth = initCloth;

  let lasttime;
  function callback(millis) {
    if (lasttime) {
      let delta_time = (millis - lasttime) / 1000;
      update(delta_time);
      draw();
    }
    lasttime = millis;
    requestAnimationFrame(callback);
  }
  callback(0);
}

Main();
