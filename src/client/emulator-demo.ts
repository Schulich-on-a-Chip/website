import { sock_init, sock_load_sprite, sock_draw, sock_render } from './sock.js';

const width = 320;
const height = 240;

const screen: HTMLCanvasElement = document.getElementById('screen')! as HTMLCanvasElement;
sock_init(screen, width, height);

// const img = new Image();
// img.src = 'images/dude.png';
const dude = sock_load_sprite('images/dude.png');
const bush = sock_load_sprite('images/bush.jpeg');

var speed = 4;
var x = width;

var y = 100;
var isJumping = false;

document.addEventListener('keydown', (e) => {
    if (e.code == 'Space' && y == 100) {
        isJumping = true;
    }
})

function render() {
    
    // Move forward
    x -= speed;
    if (x < -100) {
        x = width + Math.random() * 50;
    }

    // Jumping
    if (isJumping) {
        if (y > 20) {
            // Going up
            y -= 4;
        } else {
            isJumping = false;
        }
    } else if (y < 100) {
        y += 4;
    } else {
        y = 100;
    }

    sock_draw({ sprite: bush, transform: { position: [x, 110], scale: 0.7 } });
    sock_draw({ sprite: dude, transform: { position: [50, y], scale: 1 } });
    sock_render();
    requestAnimationFrame(render);
}

window.requestAnimationFrame(render);