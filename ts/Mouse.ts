import Vec2 from './Vec2.js'

export default class Mouse {
  button: number;
  pos: Vec2;
  prev_pos: Vec2;
  down: boolean;
  canvas: HTMLCanvasElement;
  onmouseup_callsbacks:any[];
  onmousedown_callsbacks:any[];

  constructor(canvas) {
    this.canvas = canvas;
    this.pos = new Vec2();
    this.prev_pos = new Vec2();
    this.register_handlers();
    this.onmouseup_callsbacks = [];
    this.onmousedown_callsbacks = [];
  }

  get direction():Vec2 {
    return this.pos.sub(this.prev_pos);
  }

  register_handlers():void {
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
        e.preventDefault();
    };
  }
}
