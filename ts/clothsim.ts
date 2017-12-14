import Vec3 from './Vec3.js'
import Particle from './Particle.js'
import FixedForce from './FixedForce.js'
import Rect from './Rect.js'
import Cloth from './Cloth.js'
import * as rand from './rand.js'
import UIValue from './UIValue.js'
import Mouse from './Mouse.js'

var canvas = <HTMLCanvasElement> <any> document.getElementById('canvas');
var context = <CanvasRenderingContext2D> <any> canvas.getContext('2d');
var mouse = new Mouse(canvas);

var clothes : Cloth[] = [
  new Cloth('top', new Vec3(100, 100, 0), 'darkred', mouse, 'x')
  // new Cloth('bottom', new Vec3(100, 300, 0), 'purple', mouse, 'y')
];
// var clothes : Cloth[] = [
//     new Cloth('top', new Vec2(100, 100), 'red', mouse, 'y')];

function initKeyboard() {
  document.addEventListener('keydown', function(e) {
    if (e.code == 'Space') {
      // shoot();
      e.preventDefault();
    }
  });
}

function draw() {
  context.fillStyle = 'rgba(0,0,0,1)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  clothes.forEach(cloth => {
    cloth.draw(context);
  });
}

function simulate(delta_time) {
  clothes.forEach(cloth => {
    cloth.simulate(delta_time);
  });
}

let updateCounter = 0;
let updateInterval = 1 / 180;
const MAX_SIMULATIONS_PER_FRAME = 10;
function update(delta_time) {
  const speed = UIValue('speed', 10, 1, 200, 1);
  const MAX_COUNTER = updateInterval * MAX_SIMULATIONS_PER_FRAME * speed;
  delta_time *= speed;
  updateCounter += delta_time;
  if (updateCounter > MAX_COUNTER) {
    console.warn('Skipping frames!');
    updateCounter = MAX_COUNTER;
  }
  while (updateCounter >= updateInterval) {
    simulate(updateInterval);
    updateCounter -= updateInterval;
  }
}

function initCloth() {
  clothes[0].init('x');
  // clothes[1].init('y');
}

function Main() {
  initKeyboard();
  initCloth();
  (<any>window).clothes = clothes;
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
