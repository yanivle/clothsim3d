import Vec2 from './Vec2.js';
export default class Mouse {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }
    reset() {
        this.pos = new Vec2(1000, 1000);
        this.prev_pos = new Vec2(1000, 1000);
        this.register_handlers();
        this.onmouseup_callsbacks = [];
        this.onmousedown_callsbacks = [];
        this.onmousemove_callsbacks = [];
    }
    get direction() {
        return this.pos.sub(this.prev_pos);
    }
    register_handlers() {
        let mouse = this;
        this.canvas.onmousedown = function (e) {
            mouse.button = e.which;
            mouse.prev_pos = mouse.pos.copy();
            let rect = mouse.canvas.getBoundingClientRect();
            mouse.pos.x = e.clientX - rect.left;
            mouse.pos.y = e.clientY - rect.top;
            mouse.down = true;
            mouse.onmousedown_callsbacks.forEach(callback => {
                callback();
            });
            e.preventDefault();
        };
        this.canvas.onmouseup = function (e) {
            mouse.down = false;
            mouse.onmouseup_callsbacks.forEach(callback => {
                callback();
            });
            e.preventDefault();
        };
        this.canvas.onmousemove = function (e) {
            mouse.prev_pos = mouse.pos.copy();
            var rect = mouse.canvas.getBoundingClientRect();
            mouse.pos.x = e.clientX - rect.left;
            mouse.pos.y = e.clientY - rect.top;
            mouse.onmousemove_callsbacks.forEach(callback => {
                callback();
            });
            e.preventDefault();
        };
    }
}
