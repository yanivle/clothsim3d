import Vec2 from './Vec2.js';
import Cloth from './Cloth.js';
import UIValue from './UIValue.js';
import Mouse from './Mouse.js';
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var mouse = new Mouse(canvas);
var clothes = [
    new Cloth('top', new Vec2(100, 100), 'darkred', mouse, 'x'),
    new Cloth('bottom', new Vec2(100, 300), 'purple', mouse, 'y')
];
// var clothes : Cloth[] = [
//     new Cloth('top', new Vec2(100, 100), 'red', mouse, 'y')];
function initKeyboard() {
    document.addEventListener('keydown', function (e) {
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
    clothes[1].init('y');
}
function Main() {
    initKeyboard();
    initCloth();
    window.clothes = clothes;
    window.initCloth = initCloth;
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
